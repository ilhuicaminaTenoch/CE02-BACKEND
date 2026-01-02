import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductQueryDto } from './dto/product-query.dto';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Products')
@ApiBearerAuth()
@Public()
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @ApiOperation({ summary: 'List all products with filters and pagination' })
    findAll(@Query() query: ProductQueryDto) {
        return this.productsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Product found' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async findOne(@Param('id') id: string) {
        const product = await this.productsService.findOne(id);
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }
}
