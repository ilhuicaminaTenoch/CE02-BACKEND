import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { AddItemDto, UpdateItemDto } from './dto/add-item.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { SyscomService } from '../syscom/syscom.service';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private syscom: SyscomService,
    ) { }

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

    async submitOrder(customerId: string) {
        const cart = await this.prisma.order.findFirst({
            where: { customerId, status: OrderStatus.DRAFT },
            include: { items: true },
        });

        if (!cart || cart.items.length === 0) {
            throw new BadRequestException('Cart is empty or not found');
        }

        return this.prisma.order.update({
            where: { id: cart.id },
            data: { status: OrderStatus.SUBMITTED },
            include: { items: true },
        });
    }

    async findAll(query: OrderQueryDto) {
        const { page, limit, status, customerId } = query;
        const skip = (page - 1) * limit;

        const where = {
            ...(status && { status }),
            ...(customerId && { customerId }),
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
            include: { customer: true, items: true, appointments: true },
        });
    }

    private async recalculateTotals(orderId: string, tx: Prisma.TransactionClient) {
        const items = await (tx as any).orderItem.findMany({ where: { orderId } });
        const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
        const total = subtotal; // No tax/discount for MVP

        return (tx as any).order.update({
            where: { id: orderId },
            data: { subtotal, total },
            include: { items: true },
        });
    }
}
