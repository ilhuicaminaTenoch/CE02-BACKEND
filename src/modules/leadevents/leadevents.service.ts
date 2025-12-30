import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LeadEventType, LeadEvent } from '@prisma/client';
import { randomUUID } from 'crypto';

export interface CreateLeadEventDto {
    customerId: string;
    leadId?: string;
    type: LeadEventType;
    metadata?: any;
    ip?: string;
    userAgent?: string;
}

@Injectable()
export class LeadEventsService {
    constructor(private prisma: PrismaService) { }

    async createEvent(dto: CreateLeadEventDto): Promise<LeadEvent> {
        return this.prisma.leadEvent.create({
            data: {
                id: randomUUID(),
                customerId: dto.customerId,
                leadId: dto.leadId,
                type: dto.type,
                metadata: dto.metadata || {},
                ip: dto.ip,
                userAgent: dto.userAgent,
            },
        });
    }
}
