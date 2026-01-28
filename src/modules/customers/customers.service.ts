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

        // 1. Check for existing customer by email OR phone
        const existingCustomer = await this.prisma.customer.findFirst({
            where: {
                OR: [{ email }, { phone }],
            },
            include: { addresses: true },
        });

        let customer;

        try {
            if (existingCustomer) {
                // 2. INTELLIGENT UPDATE: Update basic info and ADD new addresses
                customer = await this.prisma.customer.update({
                    where: { id: existingCustomer.id },
                    data: {
                        name,
                        lastName,
                        addresses: {
                            create: addresses?.map(address => ({
                                street: address.street,
                                city: address.city,
                                state: address.state,
                                zipCode: address.zipCode,
                                noInt: address.noInt,
                                noExt: address.noExt || (address as any).NoExt,
                                settlement: address.settlement,
                            })) || [],
                        },
                    },
                    include: { addresses: true },
                });
            } else {
                // 3. CREATE NEW: Standard creation flow
                customer = await this.prisma.customer.create({
                    data: {
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
                                noExt: address.noExt || (address as any).NoExt,
                                settlement: address.settlement,
                            })) || [],
                        },
                    },
                    include: { addresses: true },
                });
            }

            // 4. Track LeadEvent regardless of create or update
            await this.leadEventsService.createEvent({
                customerId: customer.id,
                type: LeadEventType.CUSTOMER_CREATED,
                metadata: {
                    action: existingCustomer ? 'CUSTOMER_UPDATED_FROM_FUNNEL' : 'CUSTOMER_CREATED',
                    utm_source,
                    utm_medium: createCustomerDto.utm_medium,
                    utm_campaign,
                    utm_content: createCustomerDto.utm_content,
                    utm_term: createCustomerDto.utm_term,
                    referrer,
                    landingPath,
                },
                ip,
                userAgent,
            });

            console.log(customer);
            return customer;
        } catch (error) {
            console.error('Error in customer creation/update:', error);
            // Fallback for extreme race conditions
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
                return this.prisma.customer.findFirst({
                    where: { OR: [{ email }, { phone }] },
                    include: { addresses: true },
                });
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
