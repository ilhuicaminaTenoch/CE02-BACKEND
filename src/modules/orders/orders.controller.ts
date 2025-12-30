import { Controller, Get, Post, Body, Param, Query, Patch, Delete, NotFoundException, Ip, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { AddItemDto, UpdateItemDto } from './dto/add-item.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('Orders & Cart')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order (DRAFT)' })
    create(@Body() createOrderDto: CreateOrderDto) {
        return this.ordersService.create(createOrderDto);
    }

    @Patch(':id/submit')
    @ApiOperation({ summary: 'Submit an order by ID' })
    submitById(
        @Param('id') id: string,
        @Body('leadId') leadId: string,
        @Ip() ip: string,
        @Headers('user-agent') userAgent: string,
    ) {
        return this.ordersService.submitOrderById(id, leadId, ip, userAgent);
    }

    @Get('cart')
    @ApiOperation({ summary: 'Get active cart for a customer' })
    getCart(@Query('customerId') customerId: string) {
        return this.ordersService.getOrCreateCart(customerId);
    }

    @Post('cart/items')
    @ApiOperation({ summary: 'Add item to cart' })
    addItem(@Body() addItemDto: AddItemDto) {
        return this.ordersService.addItem(addItemDto);
    }

    @Patch('cart/items/:itemId')
    @ApiOperation({ summary: 'Update item quantity in cart' })
    updateItem(@Param('itemId') itemId: string, @Body() updateItemDto: UpdateItemDto) {
        return this.ordersService.updateItem(itemId, updateItemDto);
    }

    @Delete('cart/items/:itemId')
    @ApiOperation({ summary: 'Remove item from cart' })
    removeItem(@Param('itemId') itemId: string) {
        return this.ordersService.removeItem(itemId);
    }

    @Post('cart/submit')
    @ApiOperation({ summary: 'Submit cart (classic endpoint)' })
    submit(
        @Body('customerId') customerId: string,
        @Ip() ip: string,
        @Headers('user-agent') userAgent: string,
    ) {
        return this.ordersService.submitOrder(customerId, ip, userAgent);
    }

    @Get()
    @ApiOperation({ summary: 'List all orders with filters' })
    findAll(@Query() query: OrderQueryDto) {
        return this.ordersService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details' })
    async findOne(@Param('id') id: string) {
        const order = await this.ordersService.findOne(id);
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }
}
