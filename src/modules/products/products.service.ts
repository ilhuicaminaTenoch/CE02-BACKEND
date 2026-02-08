import { Injectable, NotFoundException } from '@nestjs/common';
import { SyscomService } from '../syscom/syscom.service';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
    constructor(private syscom: SyscomService) { }

    async findAll(query: ProductQueryDto) {
        const [data, exchangeRate] = await Promise.all([
            this.syscom.getProducts(query),
            this.syscom.getExchangeRate(),
        ]);

        if (!data || !data.productos) {
            return {
                items: [],
                meta: {
                    total: 0,
                    page: query.page,
                    limit: query.limit,
                    totalPages: 0,
                },
            };
        }

        const items = data.productos.map((p: any) => this.mapProduct(p, exchangeRate));

        return {
            items,
            meta: {
                total: data.paginas * query.limit,
                page: query.page,
                limit: query.limit,
                totalPages: data.paginas,
            },
        };
    }

    async findOne(id: string) {
        const [product, exchangeRate] = await Promise.all([
            this.syscom.getProduct(id),
            this.syscom.getExchangeRate(),
        ]);
        if (!product) throw new NotFoundException('Product not found in Syscom');
        return this.mapProduct(product, exchangeRate);
    }

    private mapProduct(p: any, exchangeRate: number) {
        const MARGIN_MULTIPLIER = 1.15;
        const basePriceUsd = parseFloat(p.precios?.precio_lista || '0');
        const priceUsd = basePriceUsd * MARGIN_MULTIPLIER;
        const priceMxn = priceUsd * exchangeRate;

        return {
            id: p.producto_id,
            name: p.titulo,
            model: p.modelo,
            description: p.titulo,
            price: Math.round(priceMxn * 100) / 100, // Round to 2 decimals
            priceUsd: Math.round(priceUsd * 100) / 100,
            exchangeRate: exchangeRate,
            stock: p.total_existencia || 0,
            image: p.img_portada,
            category: p.categorias?.[0]?.nombre || 'General',
        };
    }
}
