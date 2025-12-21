import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) { }

    async create(createAppointmentDto: CreateAppointmentDto) {
        return this.prisma.appointment.create({
            data: createAppointmentDto,
            include: { customer: true, lead: true, order: true },
        });
    }

    async findAll(query: PaginationDto) {
        const { page, limit, search } = query;
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            this.prisma.appointment.findMany({
                skip,
                take: limit,
                include: { customer: true, lead: true, order: true },
                orderBy: { date: 'asc' },
            }),
            this.prisma.appointment.count(),
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
            include: { customer: true, lead: true, order: true },
        });
    }

    async update(id: string, data: Partial<CreateAppointmentDto>) {
        return this.prisma.appointment.update({
            where: { id },
            data,
        });
    }
}
