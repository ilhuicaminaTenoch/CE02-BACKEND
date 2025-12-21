import { SyscomService } from '../syscom/syscom.service';
import { ProductQueryDto } from './dto/product-query.dto';
export declare class ProductsService {
    private syscom;
    constructor(syscom: SyscomService);
    findAll(query: ProductQueryDto): Promise<{
        items: any;
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: any;
        };
    }>;
    findOne(id: string): Promise<{
        id: any;
        name: any;
        model: any;
        description: any;
        price: number;
        priceUsd: number;
        exchangeRate: number;
        stock: any;
        image: any;
        category: any;
    }>;
    private mapProduct;
}
