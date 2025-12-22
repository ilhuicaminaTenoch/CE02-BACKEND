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
let OrdersService = class OrdersService {
    constructor(prisma, syscom) {
        this.prisma = prisma;
        this.syscom = syscom;
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
    async submitOrder(customerId) {
        const cart = await this.prisma.order.findFirst({
            where: { customerId, status: client_1.OrderStatus.DRAFT },
            include: { items: true },
        });
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty or not found');
        }
        return this.prisma.order.update({
            where: { id: cart.id },
            data: { status: client_1.OrderStatus.SUBMITTED },
            include: { items: true },
        });
    }
    async findAll(query) {
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
    async findOne(id) {
        return this.prisma.order.findUnique({
            where: { id },
            include: { customer: true, items: true },
        });
    }
    async recalculateTotals(orderId, tx) {
        const items = await tx.orderItem.findMany({ where: { orderId } });
        const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
        const total = subtotal;
        return tx.order.update({
            where: { id: orderId },
            data: { subtotal, total },
            include: { items: true },
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        syscom_service_1.SyscomService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map