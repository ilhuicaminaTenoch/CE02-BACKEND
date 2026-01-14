import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { OrderStatus, Prisma, LeadEventType } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AddItemDto, UpdateItemDto } from './dto/add-item.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { SyscomService } from '../syscom/syscom.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { LeadEventsService } from '../leadevents/leadevents.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private syscom: SyscomService,
        private mailService: MailService,
        private leadEventsService: LeadEventsService,
    ) { }

    async create(dto: CreateOrderDto) {
        const { customerId, leadId, items } = dto;

        const exchangeRate = await this.syscom.getExchangeRate();

        const order = await this.prisma.$transaction(async (tx) => {
            const newOrder = await (tx as any).order.create({
                data: {
                    customerId,
                    leadId,
                    status: OrderStatus.DRAFT,
                },
            });

            for (const item of items) {
                const product = await this.syscom.getProduct(item.productId);
                if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

                const priceUsd = parseFloat(product.precios?.precio_lista || '0');
                const price = Math.round(priceUsd * exchangeRate * 100) / 100;

                await (tx as any).orderItem.create({
                    data: {
                        orderId: newOrder.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: price,
                        lineTotal: item.quantity * price,
                    },
                });
            }

            return this.recalculateTotals(newOrder.id, tx);
        });

        return order;
    }

    async submitOrderById(id: string, leadId?: string, ip?: string, userAgent?: string) {
        return this.prisma.$transaction(async (tx) => {
            const order = await (tx as any).order.findUnique({
                where: { id },
                include: { items: true, customer: true },
            });

            if (!order) throw new NotFoundException('Order not found');
            if (order.status !== OrderStatus.DRAFT) {
                // If it's already SUBMITTED, we can return it (idempotency)
                if (order.status === OrderStatus.SUBMITTED) return order;
                throw new ConflictException('Order is already closed or cancelled');
            }
            if (order.items.length === 0) {
                throw new BadRequestException('Order has no items');
            }

            // Infer leadId if not provided
            let finalLeadId = leadId || order.leadId;
            if (!finalLeadId) {
                const lastLead = await (tx as any).lead.findFirst({
                    where: { customerId: order.customerId },
                    orderBy: { createdAt: 'desc' },
                });
                finalLeadId = lastLead?.id;
            }

            const updatedOrder = await (tx as any).order.update({
                where: { id },
                data: {
                    status: OrderStatus.SUBMITTED,
                    leadId: finalLeadId,
                },
                include: { items: true, customer: true },
            });

            // Register LeadEvent
            await this.leadEventsService.createEvent({
                customerId: updatedOrder.customerId,
                leadId: updatedOrder.leadId || undefined,
                type: LeadEventType.ORDER_SUBMITTED,
                metadata: {
                    total: updatedOrder.total,
                    orderId: updatedOrder.id,
                    itemCount: updatedOrder.items.length,
                },
                ip,
                userAgent,
            });

            // Background process to enrich and send email
            this.enrichAndSendEmail(updatedOrder).catch(err => {
                console.error('Failed to trigger email notification:', err);
            });

            return updatedOrder;
        });
    }

    async getOrCreateCart(customerId: string) {
        let cart = await this.prisma.order.findFirst({
            where: { customerId, status: OrderStatus.DRAFT },
            include: { items: true },
        });

        if (!cart) {
            cart = await this.prisma.order.create({
                data: { customerId, status: OrderStatus.DRAFT },
                include: { items: true },
            });
        }

        return cart;
    }

    async addItem(addItemDto: AddItemDto) {
        const { customerId, productId, quantity } = addItemDto;

        const [product, exchangeRate] = await Promise.all([
            this.syscom.getProduct(productId),
            this.syscom.getExchangeRate(),
        ]);

        if (!product) throw new NotFoundException('Product not found in Syscom');

        const priceUsd = parseFloat(product.precios?.precio_lista || '0');
        const price = Math.round(priceUsd * exchangeRate * 100) / 100;
        const stock = product.total_existencia || 0;

        if (stock < quantity) throw new BadRequestException('Not enough stock');

        const cart = await this.getOrCreateCart(customerId);

        return this.prisma.$transaction(async (tx) => {
            const transactionalClient = tx as Prisma.TransactionClient;
            // Check if item already exists
            const existingItem = cart.items.find((i) => i.productId === productId);

            if (existingItem) {
                await (transactionalClient as any).orderItem.update({
                    where: { id: existingItem.id },
                    data: {
                        quantity: existingItem.quantity + quantity,
                        lineTotal: (existingItem.quantity + quantity) * price,
                    },
                });
            } else {
                await (transactionalClient as any).orderItem.create({
                    data: {
                        orderId: cart.id,
                        productId,
                        quantity,
                        unitPrice: price,
                        lineTotal: quantity * price,
                    },
                });
            }

            return this.recalculateTotals(cart.id, transactionalClient);
        });
    }

    async updateItem(itemId: string, updateItemDto: UpdateItemDto) {
        const { quantity } = updateItemDto;

        const item = await this.prisma.orderItem.findUnique({
            where: { id: itemId },
        });

        if (!item) throw new NotFoundException('Item not found');

        const product = await this.syscom.getProduct(item.productId);
        const stock = product?.total_existencia || 0;
        if (stock < quantity) throw new BadRequestException('Not enough stock');

        return this.prisma.$transaction(async (tx) => {
            await (tx as any).orderItem.update({
                where: { id: itemId },
                data: {
                    quantity,
                    lineTotal: quantity * item.unitPrice,
                },
            });

            return this.recalculateTotals(item.orderId, tx);
        });
    }

    async removeItem(itemId: string) {
        const item = await this.prisma.orderItem.findUnique({ where: { id: itemId } });
        if (!item) throw new NotFoundException('Item not found');

        return this.prisma.$transaction(async (tx) => {
            await (tx as any).orderItem.delete({ where: { id: itemId } });
            return this.recalculateTotals(item.orderId, tx);
        });
    }

    async submitOrder(customerId: string, ip?: string, userAgent?: string) {
        const cart = await this.prisma.order.findFirst({
            where: { customerId, status: OrderStatus.DRAFT },
            include: { items: true },
        });

        if (!cart || cart.items.length === 0) {
            throw new BadRequestException('Cart is empty or not found');
        }

        // Use the new method to maintain consistency
        return this.submitOrderById(cart.id, undefined, ip, userAgent);
    }

    async updateLaborCost(id: string, laborCost: number) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) throw new NotFoundException('Order not found');

        return this.prisma.$transaction(async (tx) => {
            await (tx as any).order.update({
                where: { id },
                data: { laborCost },
            });
            return this.recalculateTotals(id, tx);
        });
    }

    async quoteOrder(id: string, laborCost?: number) {
        return this.prisma.$transaction(async (tx) => {
            const order = await (tx as any).order.findUnique({
                where: { id },
            });

            if (!order) throw new NotFoundException('Order not found');
            if (order.status !== OrderStatus.SUBMITTED) {
                if (order.status === OrderStatus.QUOTED) return order;
                throw new ConflictException('Invalid status transition. Order must be SUBMITTED to be QUOTED.');
            }

            // Update laborCost if provided in request
            let finalLaborCost = order.laborCost;
            if (laborCost !== undefined && laborCost !== null) {
                await (tx as any).order.update({
                    where: { id },
                    data: { laborCost },
                });
                finalLaborCost = laborCost;
            }

            // Validation: laborCost must not be null
            if (finalLaborCost === null || finalLaborCost === undefined) {
                throw new BadRequestException('laborCost must be set before quoting a SUBMITTED order');
            }

            const updatedOrder = await (tx as any).order.update({
                where: { id },
                data: { status: OrderStatus.QUOTED },
                include: { items: true, customer: true },
            });

            // Recalculate to ensure total is correct with laborCost and status
            const finalOrder = await this.recalculateTotals(id, tx);

            // Register LeadEvent
            await this.leadEventsService.createEvent({
                customerId: updatedOrder.customerId,
                leadId: updatedOrder.leadId || undefined,
                type: LeadEventType.ORDER_QUOTED,
                metadata: {
                    total: finalOrder.total,
                    laborCost: finalOrder.laborCost,
                    orderId: finalOrder.id,
                },
            });

            return finalOrder;
        });
    }

    private async enrichAndSendEmail(order: any) {
        try {
            // Enrich items with product titles from Syscom
            const enrichedItems = await Promise.all(
                order.items.map(async (item) => {
                    const product = await this.syscom.getProduct(item.productId);
                    return {
                        ...item,
                        productTitle: product?.titulo || `SKU: ${item.productId}`,
                    };
                })
            );

            await this.mailService.sendOrderQuoteEmail(order.id, {
                ...order,
                items: enrichedItems,
            });
        } catch (error) {
            // Silently log error as requested
            console.error('Error in enrichAndSendEmail:', error);
        }
    }

    async findAll(query: OrderQueryDto) {
        const { page, limit, status, customerId, search } = query;
        const skip = (page - 1) * limit;

        const normalized = (search ?? '').trim().replace(/\s+/g, ' ').slice(0, 60);
        const tokens = normalized ? normalized.split(' ') : [];

        const customerSearchWhere: Prisma.OrderWhereInput =
            tokens.length > 0
                ? {
                    customer: {
                        AND: tokens.map((t) => {
                            const digits = t.replace(/\D/g, '');
                            return {
                                OR: [
                                    { name: { contains: t, mode: 'insensitive' } },
                                    { lastName: { contains: t, mode: 'insensitive' } },
                                    { email: { contains: t, mode: 'insensitive' } },
                                    { phone: { contains: t } },
                                    ...(digits && digits !== t ? [{ phone: { contains: digits } }] : []),
                                ],
                            };
                        }),
                    },
                }
                : {};

        const where: Prisma.OrderWhereInput = {
            ...(status && { status }),
            ...(customerId && { customerId }),
            ...customerSearchWhere,
        };

        const [items, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                skip,
                take: limit,
                include: { customer: true, items: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.order.count({ where }),
        ]);

        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        return this.prisma.order.findUnique({
            where: { id },
            include: { customer: true, items: true },
        });
    }

    private async recalculateTotals(orderId: string, tx: Prisma.TransactionClient) {
        const order = await (tx as any).order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });

        if (!order) throw new NotFoundException('Order not found');

        const subtotal = order.items.reduce((sum, item) => sum + item.lineTotal, 0);
        const laborCost = order.laborCost ?? 0;
        const total = subtotal + laborCost;

        return (tx as any).order.update({
            where: { id: orderId },
            data: { subtotal, total },
            include: { items: true, customer: true },
        });
    }
}
