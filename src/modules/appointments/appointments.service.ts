import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) { }

    async create(createAppointmentDto: CreateAppointmentDto) {
        return this.prisma.appointment.create({
            data: createAppointmentDto as unknown as Prisma.AppointmentCreateInput,
            include: { customer: true, lead: true },
        });
    }

    async findAll(query: AppointmentQueryDto) {
        const { page, limit, status, mode, customerId, leadId, search } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.AppointmentWhereInput = {
            ...(status && { status }),
            ...(mode && { mode }),
            ...(customerId && { customerId }),
            ...(leadId && { leadId }),
            // Search if needed (e.g. in comments)
            ...(search && {
                comments: { contains: search, mode: 'insensitive' },
            }),
        };

        const [items, total] = await Promise.all([
            this.prisma.appointment.findMany({
                where,
                skip,
                take: limit,
                include: { customer: true, lead: true },
                orderBy: { date: 'asc' },
            }),
            this.prisma.appointment.count({ where }),
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
        return this.prisma.appointment.findUnique({
            where: { id },
            include: { customer: true, lead: true },
        });
    }

    async update(id: string, data: Partial<CreateAppointmentDto>) {
        return this.prisma.appointment.update({
            where: { id },
            data,
        });
    }
}
