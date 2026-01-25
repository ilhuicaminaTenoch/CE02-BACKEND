import { Controller, Get, Post, Body, Param, Query, Patch, Delete, NotFoundException, Ip, Headers, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { AddItemDto, UpdateItemDto } from './dto/add-item.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateLaborCostDto } from './dto/update-labor-cost.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole, OrderStatus } from '@prisma/client';
import { MonthOverMonthMetricsDto } from '@/common/dto/metrics-response.dto';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Orders & Cart')
@ApiBearerAuth()
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

    @Get('metrics/month-over-month')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get order metrics comparing current month vs previous month (ADMIN only)' })
    @ApiQuery({ name: 'status', enum: OrderStatus, required: false, description: 'Filter by order status' })
    @ApiQuery({ name: 'tzOffsetMinutes', required: false, type: Number, description: 'Timezone offset in minutes (e.g. 360 for UTC-6)' })
    @ApiOkResponse({ type: MonthOverMonthMetricsDto })
    getMonthOverMonthMetrics(
        @Query('status') status?: OrderStatus,
        @Query('tzOffsetMinutes') tzOffsetMinutes?: string,
    ) {
        return this.ordersService.getMonthOverMonthMetrics(
            status,
            tzOffsetMinutes ? parseInt(tzOffsetMinutes, 10) : 0,
        );
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details' })
    async findOne(@Param('id') id: string) {
        const order = await this.ordersService.findOne(id);
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    @Patch(':id/labor-cost')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update labor cost for an order (ADMIN only)' })
    updateLaborCost(
        @Param('id') id: string,
        @Body() dto: UpdateLaborCostDto,
    ) {
        return this.ordersService.updateLaborCost(id, dto.laborCost);
    }

    @Patch(':id/quote')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Transition order from SUBMITTED to QUOTED (ADMIN only)' })
    quoteOrder(
        @Param('id') id: string,
        @Body() dto: Partial<UpdateLaborCostDto>,
    ) {
        return this.ordersService.quoteOrder(id, dto.laborCost);
    }
}
