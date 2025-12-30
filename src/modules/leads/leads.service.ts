import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
import { Prisma, LeadEventType } from '@prisma/client';
import { LeadEventsService } from '../leadevents/leadevents.service';

@Injectable()
export class LeadsService {
    constructor(
        private prisma: PrismaService,
        private leadEventsService: LeadEventsService,
    ) { }

    async create(createLeadDto: CreateLeadDto, ip?: string, userAgent?: string) {
        const {
            utm_source,
            utm_medium,
            utm_campaign,
            utm_content,
            utm_term,
            referrer,
            landingPath,
            ...leadData
        } = createLeadDto;

        const lead = await this.prisma.lead.create({
            data: leadData as unknown as Prisma.LeadCreateInput,
            include: { customer: true },
        });

        await this.leadEventsService.createEvent({
            customerId: lead.customerId,
            leadId: lead.id,
            type: LeadEventType.LEAD_CREATED,
            metadata: {
                serviceType: lead.serviceType,
                propertyType: lead.propertyType,
                urgency: lead.urgency,
                utm_source,
                utm_medium,
                utm_campaign,
                utm_content,
                utm_term,
                referrer,
                landingPath,
            },
            ip,
            userAgent,
        });

        return lead;
    }

    async findAll(query: LeadQueryDto) {
        const { page, limit, serviceType, urgency, propertyType, customerId, search } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.LeadWhereInput = {
            ...(serviceType && { serviceType }),
            ...(urgency && { urgency }),
            ...(propertyType && { propertyType }),
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

    async update(id: string, data: Partial<CreateLeadDto>, ip?: string, userAgent?: string) {
        const {
            utm_source,
            utm_medium,
            utm_campaign,
            utm_content,
            utm_term,
            referrer,
            landingPath,
            ...leadData
        } = data;

        const lead = await this.prisma.lead.update({
            where: { id },
            data: leadData as unknown as Prisma.LeadUpdateInput,
        });

        await this.leadEventsService.createEvent({
            customerId: lead.customerId,
            leadId: lead.id,
            type: LeadEventType.LEAD_UPDATED,
            metadata: {
                changedFields: Object.keys(data),
                ...data,
            },
            ip,
            userAgent,
        });

        return lead;
    }
}
