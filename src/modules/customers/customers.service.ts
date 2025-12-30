import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { Prisma, LeadEventType } from '@prisma/client';
import { LeadEventsService } from '../leadevents/leadevents.service';

@Injectable()
export class CustomersService {
    constructor(
        private prisma: PrismaService,
        private leadEventsService: LeadEventsService,
    ) { }

    async create(createCustomerDto: CreateCustomerDto, ip?: string, userAgent?: string) {
        const {
            addresses,
            email,
            name,
            lastName,
            phone,
            contactMethod,
            utm_source,
            utm_campaign,
            referrer,
            landingPath,
        } = createCustomerDto;

        // Check if customer already exists for idempotency/upsert-like behavior
        const existingCustomer = await this.prisma.customer.findUnique({
            where: { email },
            include: { addresses: true },
        });

        if (existingCustomer) {
            // Return existing customer instead of throwing error
            return existingCustomer;
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
                        noExt: address.noExt,
                        settlement: address.settlement,
                    })) || [],
                },
            };

            const customer = await this.prisma.customer.create({
                data: dataForPrisma,
                include: { addresses: true },
            });

            // Register LeadEvent
            await this.leadEventsService.createEvent({
                customerId: customer.id,
                type: LeadEventType.CUSTOMER_CREATED,
                metadata: {
                    utm_source: createCustomerDto.utm_source,
                    utm_medium: createCustomerDto.utm_medium,
                    utm_campaign: createCustomerDto.utm_campaign,
                    utm_content: createCustomerDto.utm_content,
                    utm_term: createCustomerDto.utm_term,
                    referrer: createCustomerDto.referrer,
                    landingPath: createCustomerDto.landingPath,
                },
                ip,
                userAgent,
            });

            return customer;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    // Fallback in case of race condition
                    return this.prisma.customer.findUnique({
                        where: { email },
                        include: { addresses: true },
                    });
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
        const { addresses, email, name, lastName, phone, contactMethod, ...tracking } = updateDto;

        const dataForPrisma: Prisma.CustomerUpdateInput = {
            ...(email && { email }),
            ...(name && { name }),
            ...(lastName && { lastName }),
            ...(phone && { phone }),
            ...(contactMethod && { contactMethod }),
        };

        if (addresses) {
            dataForPrisma.addresses = {
                upsert: addresses.map(address => ({
                    where: { id: (address as any).id || '' },
                    create: {
                        street: address.street,
                        city: address.city,
                        state: address.state,
                        zipCode: address.zipCode,
                        noInt: address.noInt,
                        noExt: address.noExt || (address as any).NoExt,
                        settlement: address.settlement,
                    },
                    update: {
                        street: address.street,
                        city: address.city,
                        state: address.state,
                        zipCode: address.zipCode,
                        noInt: address.noInt,
                        noExt: address.noExt || (address as any).NoExt,
                        settlement: address.settlement,
                    },
                })),
            };
        }

        try {
            const customer = await this.prisma.customer.update({
                where: { id },
                data: dataForPrisma,
                include: { addresses: true },
            });

            // Log update event
            await this.leadEventsService.createEvent({
                customerId: customer.id,
                type: LeadEventType.CUSTOMER_CREATED, // Reusing CUSTOMER_CREATED as per instructions or could use generic
                metadata: {
                    action: 'CUSTOMER_UPDATED',
                    ...tracking,
                    updatedAt: new Date().toISOString()
                }
            });

            return customer;
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
