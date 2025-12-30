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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const add_item_dto_1 = require("./dto/add-item.dto");
const order_query_dto_1 = require("./dto/order-query.dto");
const create_order_dto_1 = require("./dto/create-order.dto");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    create(createOrderDto) {
        return this.ordersService.create(createOrderDto);
    }
    submitById(id, leadId, ip, userAgent) {
        return this.ordersService.submitOrderById(id, leadId, ip, userAgent);
    }
    getCart(customerId) {
        return this.ordersService.getOrCreateCart(customerId);
    }
    addItem(addItemDto) {
        return this.ordersService.addItem(addItemDto);
    }
    updateItem(itemId, updateItemDto) {
        return this.ordersService.updateItem(itemId, updateItemDto);
    }
    removeItem(itemId) {
        return this.ordersService.removeItem(itemId);
    }
    submit(customerId, ip, userAgent) {
        return this.ordersService.submitOrder(customerId, ip, userAgent);
    }
    findAll(query) {
        return this.ordersService.findAll(query);
    }
    async findOne(id) {
        const order = await this.ordersService.findOne(id);
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        return order;
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new order (DRAFT)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/submit'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit an order by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('leadId')),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "submitById", null);
__decorate([
    (0, common_1.Get)('cart'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active cart for a customer' }),
    __param(0, (0, common_1.Query)('customerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getCart", null);
__decorate([
    (0, common_1.Post)('cart/items'),
    (0, swagger_1.ApiOperation)({ summary: 'Add item to cart' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_item_dto_1.AddItemDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)('cart/items/:itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update item quantity in cart' }),
    __param(0, (0, common_1.Param)('itemId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_item_dto_1.UpdateItemDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('cart/items/:itemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove item from cart' }),
    __param(0, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Post)('cart/submit'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit cart (classic endpoint)' }),
    __param(0, (0, common_1.Body)('customerId')),
    __param(1, (0, common_1.Ip)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List all orders with filters' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [order_query_dto_1.OrderQueryDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders & Cart'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map