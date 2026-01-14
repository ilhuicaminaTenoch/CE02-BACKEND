import { Controller, Get, Post, Body, Param, Query, Patch, NotFoundException, Ip, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Customers')
@ApiBearerAuth()
@Controller('customers')
export class CustomersController {
    constructor(private readonly customersService: CustomersService) { }

    @Public()
    @Post()
    @ApiOperation({ summary: 'Create a new customer (Public for Funnel)' })
    create(
        @Body() createCustomerDto: CreateCustomerDto,
        @Ip() ip: string,
        @Headers('user-agent') userAgent: string,
    ) {
        return this.customersService.create(createCustomerDto, ip, userAgent);
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
