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
exports.CustomersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const client_1 = require("@prisma/client");
let CustomersService = class CustomersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createCustomerDto) {
        const { addresses, email, name, lastName, phone, contactMethod } = createCustomerDto;
        const existingCustomer = await this.prisma.customer.findUnique({
            where: { email },
        });
        if (existingCustomer) {
            throw new common_1.ConflictException('Ya existe un cliente registrado con ese email.');
        }
        try {
            const dataForPrisma = {
                email,
                name,
                lastName,
                phone,
                contactMethod,
                addresses: {
                    create: addresses?.map(address => ({
                        street: address.street,
                        city: address.city,
                        state: address.state,
                        zipCode: address.zipCode,
                        noInt: address.noInt,
                        noExt: address.noExt,
                        settlement: address.settlement,
                    })) || [],
                },
            };
            return await this.prisma.customer.create({
                data: dataForPrisma,
                include: { addresses: true },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Ya existe un cliente registrado con ese email.');
                }
            }
            throw error;
        }
    }
    async findAll(query) {
        const { page, limit, search } = query;
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                    { phone: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [items, total] = await Promise.all([
            this.prisma.customer.findMany({
                where,
                skip,
                take: limit,
                include: { _count: { select: { orders: true, leads: true } } },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.customer.count({ where }),
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
        return this.prisma.customer.findUnique({
            where: { id },
            include: { addresses: true, leads: true, orders: true },
        });
    }
    async update(id, updateDto) {
        const { addresses, email, name, lastName, phone, contactMethod } = updateDto;
        const dataForPrisma = {
            ...(email && { email }),
            ...(name && { name }),
            ...(lastName && { lastName }),
            ...(phone && { phone }),
            ...(contactMethod && { contactMethod }),
            ...(addresses && {
                addresses: {
                    deleteMany: {},
                    create: addresses.map(address => ({
                        street: address.street,
                        city: address.city,
                        state: address.state,
                        zipCode: address.zipCode,
                        noInt: address.noInt,
                        noExt: address.noExt,
                        settlement: address.settlement,
                    })),
                },
            }),
        };
        try {
            return await this.prisma.customer.update({
                where: { id },
                data: dataForPrisma,
                include: { addresses: true },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ConflictException('Ya existe un cliente registrado con ese email.');
                }
            }
            throw error;
        }
    }
};
exports.CustomersService = CustomersService;
exports.CustomersService = CustomersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CustomersService);
//# sourceMappingURL=customers.service.js.map