import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class LeadsService {
    constructor(private prisma: PrismaService) { }

    async create(createLeadDto: CreateLeadDto) {
        return this.prisma.lead.create({
            data: createLeadDto,
            include: { customer: true },
        });
    }

    async findAll(query: LeadQueryDto) {
        const { page, limit, serviceType, urgency, customerId, search } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.LeadWhereInput = {
            ...(serviceType && { serviceType }),
            ...(urgency && { urgency }),
            ...(customerId && { customerId }),
            ...(search && {
                description: { contains: search, mode: 'insensitive' },
            }),
        };

        const [items, total] = await Promise.all([
            this.prisma.lead.findMany({
                where,
                skip,
                take: limit,
                include: { customer: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.lead.count({ where }),
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
        return this.prisma.lead.findUnique({
            where: { id },
            include: { customer: true, appointments: true },
        });
    }

    async update(id: string, data: Partial<CreateLeadDto>) {
        return this.prisma.lead.update({
            where: { id },
            data,
        });
    }
}
