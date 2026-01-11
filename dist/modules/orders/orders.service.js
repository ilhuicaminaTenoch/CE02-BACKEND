"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const syscom_service_1 = require("../syscom/syscom.service");
const leadevents_service_1 = require("../leadevents/leadevents.service");
const mail_service_1 = require("../mail/mail.service");
let OrdersService = class OrdersService {
    constructor(prisma, syscom, mailService, leadEventsService) {
        this.prisma = prisma;
        this.syscom = syscom;
        this.mailService = mailService;
        this.leadEventsService = leadEventsService;
    }
    async create(dto) {
        const { customerId, leadId, items } = dto;
        const exchangeRate = await this.syscom.getExchangeRate();
        const order = await this.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    customerId,
                    leadId,
                    status: client_1.OrderStatus.DRAFT,
                },
            });
            for (const item of items) {
                const product = await this.syscom.getProduct(item.productId);
                if (!product)
                    throw new common_1.NotFoundException(`Product ${item.productId} not found`);
                const priceUsd = parseFloat(product.precios?.precio_lista || '0');
                const price = Math.round(priceUsd * exchangeRate * 100) / 100;
                await tx.orderItem.create({
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
    async submitOrderById(id, leadId, ip, userAgent) {
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id },
                include: { items: true, customer: true },
            });
            if (!order)
                throw new common_1.NotFoundException('Order not found');
            if (order.status !== client_1.OrderStatus.DRAFT) {
                if (order.status === client_1.OrderStatus.SUBMITTED)
                    return order;
                throw new common_1.ConflictException('Order is already closed or cancelled');
            }
            if (order.items.length === 0) {
                throw new common_1.BadRequestException('Order has no items');
            }
            let finalLeadId = leadId || order.leadId;
            if (!finalLeadId) {
                const lastLead = await tx.lead.findFirst({
                    where: { customerId: order.customerId },
                    orderBy: { createdAt: 'desc' },
                });
                finalLeadId = lastLead?.id;
            }
            const updatedOrder = await tx.order.update({
                where: { id },
                data: {
                    status: client_1.OrderStatus.SUBMITTED,
                    leadId: finalLeadId,
                },
                include: { items: true, customer: true },
            });
            await this.leadEventsService.createEvent({
                customerId: updatedOrder.customerId,
                leadId: updatedOrder.leadId || undefined,
                type: client_1.LeadEventType.ORDER_SUBMITTED,
                metadata: {
                    total: updatedOrder.total,
                    orderId: updatedOrder.id,
                    itemCount: updatedOrder.items.length,
                },
                ip,
                userAgent,
            });
            this.enrichAndSendEmail(updatedOrder).catch(err => {
                console.error('Failed to trigger email notification:', err);
            });
            return updatedOrder;
        });
    }
    async getOrCreateCart(customerId) {
        let cart = await this.prisma.order.findFirst({
            where: { customerId, status: client_1.OrderStatus.DRAFT },
            include: { items: true },
        });
        if (!cart) {
            cart = await this.prisma.order.create({
                data: { customerId, status: client_1.OrderStatus.DRAFT },
                include: { items: true },
            });
        }
        return cart;
    }
    async addItem(addItemDto) {
        const { customerId, productId, quantity } = addItemDto;
        const [product, exchangeRate] = await Promise.all([
            this.syscom.getProduct(productId),
            this.syscom.getExchangeRate(),
        ]);
        if (!product)
            throw new common_1.NotFoundException('Product not found in Syscom');
        const priceUsd = parseFloat(product.precios?.precio_lista || '0');
        const price = Math.round(priceUsd * exchangeRate * 100) / 100;
        const stock = product.total_existencia || 0;
        if (stock < quantity)
            throw new common_1.BadRequestException('Not enough stock');
        const cart = await this.getOrCreateCart(customerId);
        return this.prisma.$transaction(async (tx) => {
            const transactionalClient = tx;
            const existingItem = cart.items.find((i) => i.productId === productId);
            if (existingItem) {
                await transactionalClient.orderItem.update({
                    where: { id: existingItem.id },
                    data: {
                        quantity: existingItem.quantity + quantity,
                        lineTotal: (existingItem.quantity + quantity) * price,
                    },
                });
            }
            else {
                await transactionalClient.orderItem.create({
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
    async updateItem(itemId, updateItemDto) {
        const { quantity } = updateItemDto;
        const item = await this.prisma.orderItem.findUnique({
            where: { id: itemId },
        });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        const product = await this.syscom.getProduct(item.productId);
        const stock = product?.total_existencia || 0;
        if (stock < quantity)
            throw new common_1.BadRequestException('Not enough stock');
        return this.prisma.$transaction(async (tx) => {
            await tx.orderItem.update({
                where: { id: itemId },
                data: {
                    quantity,
                    lineTotal: quantity * item.unitPrice,
                },
            });
            return this.recalculateTotals(item.orderId, tx);
        });
    }
    async removeItem(itemId) {
        const item = await this.prisma.orderItem.findUnique({ where: { id: itemId } });
        if (!item)
            throw new common_1.NotFoundException('Item not found');
        return this.prisma.$transaction(async (tx) => {
            await tx.orderItem.delete({ where: { id: itemId } });
            return this.recalculateTotals(item.orderId, tx);
        });
    }
    async submitOrder(customerId, ip, userAgent) {
        const cart = await this.prisma.order.findFirst({
            where: { customerId, status: client_1.OrderStatus.DRAFT },
            include: { items: true },
        });
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty or not found');
        }
        return this.submitOrderById(cart.id, undefined, ip, userAgent);
    }
    async updateLaborCost(id, laborCost) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return this.prisma.$transaction(async (tx) => {
            await tx.order.update({
                where: { id },
                data: { laborCost },
            });
            return this.recalculateTotals(id, tx);
        });
    }
    async quoteOrder(id, laborCost) {
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where: { id },
            });
            if (!order)
                throw new common_1.NotFoundException('Order not found');
            if (order.status !== client_1.OrderStatus.SUBMITTED) {
                if (order.status === client_1.OrderStatus.QUOTED)
                    return order;
                throw new common_1.ConflictException('Invalid status transition. Order must be SUBMITTED to be QUOTED.');
            }
            let finalLaborCost = order.laborCost;
            if (laborCost !== undefined && laborCost !== null) {
                await tx.order.update({
                    where: { id },
                    data: { laborCost },
                });
                finalLaborCost = laborCost;
            }
            if (finalLaborCost === null || finalLaborCost === undefined) {
                throw new common_1.BadRequestException('laborCost must be set before quoting a SUBMITTED order');
            }
            const updatedOrder = await tx.order.update({
                where: { id },
                data: { status: client_1.OrderStatus.QUOTED },
                include: { items: true, customer: true },
            });
            const finalOrder = await this.recalculateTotals(id, tx);
            await this.leadEventsService.createEvent({
                customerId: updatedOrder.customerId,
                leadId: updatedOrder.leadId || undefined,
                type: client_1.LeadEventType.ORDER_QUOTED,
                metadata: {
                    total: finalOrder.total,
                    laborCost: finalOrder.laborCost,
                    orderId: finalOrder.id,
                },
            });
            return finalOrder;
        });
    }
    async enrichAndSendEmail(order) {
        try {
            const enrichedItems = await Promise.all(order.items.map(async (item) => {
                const product = await this.syscom.getProduct(item.productId);
                return {
                    ...item,
                    productTitle: product?.titulo || `SKU: ${item.productId}`,
                };
            }));
            await this.mailService.sendOrderQuoteEmail(order.id, {
                ...order,
                items: enrichedItems,
            });
        }
        catch (error) {
            console.error('Error in enrichAndSendEmail:', error);
        }
    }
    async findAll(query) {
        const { page, limit, status, customerId, search } = query;
        const skip = (page - 1) * limit;
        const normalized = (search ?? '').trim().replace(/\s+/g, ' ').slice(0, 60);
        const tokens = normalized ? normalized.split(' ') : [];
        const customerSearchWhere = tokens.length > 0
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
        const where = {
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
    async findOne(id) {
        return this.prisma.order.findUnique({
            where: { id },
            include: { customer: true, items: true },
        });
    }
    async recalculateTotals(orderId, tx) {
        const order = await tx.order.findUnique({
            where: { id: orderId },
            include: { items: true },
        });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const subtotal = order.items.reduce((sum, item) => sum + item.lineTotal, 0);
        const laborCost = order.laborCost ?? 0;
        const total = subtotal + laborCost;
        return tx.order.update({
            where: { id: orderId },
            data: { subtotal, total },
            include: { items: true, customer: true },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        syscom_service_1.SyscomService,
        mail_service_1.MailService,
        leadevents_service_1.LeadEventsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map