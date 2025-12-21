import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomersService {
    constructor(private prisma: PrismaService) { }

    async create(createCustomerDto: CreateCustomerDto) {
        const { addresses, email, name, lastName, phone, contactMethod } = createCustomerDto;

        // Check if customer already exists (Explicit check for better error message)
        const existingCustomer = await this.prisma.customer.findUnique({
            where: { email },
        });

        if (existingCustomer) {
            throw new ConflictException('Ya existe un cliente registrado con ese email.');
        }

        try {
            const dataForPrisma: Prisma.CustomerCreateInput = {
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
                        noExt: address.noExt, // Corrected from NoExt
                        settlement: address.settlement,
                    })) || [],
                },
            };

            return await this.prisma.customer.create({
                data: dataForPrisma,
                include: { addresses: true },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Ya existe un cliente registrado con ese email.');
                }
            }
            throw error;
        }
    }

    async findAll(query: PaginationDto) {
        const { page, limit, search } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.CustomerWhereInput = search
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

    async findOne(id: string) {
        return this.prisma.customer.findUnique({
            where: { id },
            include: { addresses: true, leads: true, orders: true },
        });
    }

    async update(id: string, updateDto: Partial<CreateCustomerDto>) {
        const { addresses, email, name, lastName, phone, contactMethod } = updateDto;

        const dataForPrisma: Prisma.CustomerUpdateInput = {
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
                        noExt: address.noExt, // Corrected from NoExt
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
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException('Ya existe un cliente registrado con ese email.');
                }
            }
            throw error;
        }
    }
}
