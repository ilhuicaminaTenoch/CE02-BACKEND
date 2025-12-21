import { Controller, Get, Post, Body, Param, Query, Patch, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new customer' })
    create(@Body() createCustomerDto: CreateCustomerDto) {
        return this.customersService.create(createCustomerDto);
    }

    @Get()
    @ApiOperation({ summary: 'List customers with search and pagination' })
    findAll(@Query() query: PaginationDto) {
        return this.customersService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get customer by ID' })
    async findOne(@Param('id') id: string) {
        const customer = await this.customersService.findOne(id);
        if (!customer) throw new NotFoundException('Customer not found');
        return customer;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update customer data' })
    update(@Param('id') id: string, @Body() data: Partial<CreateCustomerDto>) {
        return this.customersService.update(id, data);
    }
}
