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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const syscom_service_1 = require("../syscom/syscom.service");
let ProductsService = class ProductsService {
    constructor(syscom) {
        this.syscom = syscom;
    }
    async findAll(query) {
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
        const items = data.productos.map((p) => this.mapProduct(p, exchangeRate));
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
    async findOne(id) {
        const [product, exchangeRate] = await Promise.all([
            this.syscom.getProduct(id),
            this.syscom.getExchangeRate(),
        ]);
        if (!product)
            throw new common_1.NotFoundException('Product not found in Syscom');
        return this.mapProduct(product, exchangeRate);
    }
    mapProduct(p, exchangeRate) {
        const priceUsd = parseFloat(p.precios?.precio_lista || '0');
        const priceMxn = priceUsd * exchangeRate;
        return {
            id: p.producto_id,
            name: p.titulo,
            model: p.modelo,
            description: p.titulo,
            price: Math.round(priceMxn * 100) / 100,
            priceUsd: priceUsd,
            exchangeRate: exchangeRate,
            stock: p.total_existencia || 0,
            image: p.img_portada,
            category: p.categorias?.[0]?.nombre || 'General',
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [syscom_service_1.SyscomService])
], ProductsService);
//# sourceMappingURL=products.service.js.map