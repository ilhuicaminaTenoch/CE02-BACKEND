import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { Prisma, LeadEventType } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { LeadEventsService } from '../leadevents/leadevents.service';

@Injectable()
export class AppointmentsService {
    constructor(
        private prisma: PrismaService,
        private mailService: MailService,
        private configService: ConfigService,
        private leadEventsService: LeadEventsService,
    ) { }

    async create(createAppointmentDto: CreateAppointmentDto, ip?: string, userAgent?: string) {
        const {
            utm_source,
            utm_medium,
            utm_campaign,
            utm_content,
            utm_term,
            referrer,
            landingPath,
            ...appointmentData
        } = createAppointmentDto;

        const appointment = await this.prisma.appointment.create({
            data: appointmentData as unknown as Prisma.AppointmentCreateInput,
            include: {
                customer: {
                    include: {
                        addresses: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    }
                },
                lead: true,
            },
        });

        // Register LeadEvent
        await this.leadEventsService.createEvent({
            customerId: appointment.customerId,
            leadId: appointment.leadId,
            type: LeadEventType.APPOINTMENT_SCHEDULED,
            metadata: {
                date: appointment.date,
                mode: appointment.mode,
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

        // Trigger emails in background (fail-safe)
        this.sendEmails(appointment).catch(err => {
            console.error('Error in sendEmails background task:', err);
        });

        return appointment;
    }

    private async sendEmails(appointment: any) {
        const publicUrl = this.configService.get<string>('APP_PUBLIC_URL', 'http://localhost:3000');

        // Format address based on mode
        let displayAddress = 'Consulte el panel técnico';
        if (appointment.mode === 'REMOTE') {
            displayAddress = 'N/A (Cita Remota)';
        } else if (appointment.customer.addresses && appointment.customer.addresses.length > 0) {
            const addr = appointment.customer.addresses[0];
            displayAddress = `${addr.street} ${addr.noExt}${addr.noInt ? ' Int. ' + addr.noInt : ''}, ${addr.settlement}, ${addr.city}, ${addr.state}`;
        }

        const payload = {
            appointmentId: appointment.id,
            customerName: `${appointment.customer.name} ${appointment.customer.lastName}`,
            customerEmail: appointment.customer.email,
            customerPhone: appointment.customer.phone,
            serviceType: appointment.lead?.serviceType || 'General',
            dateTimeISO: appointment.date.toISOString(),
            dateTimeFormatted: new Date(appointment.date).toLocaleString('es-MX', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
            modality: appointment.mode === 'REMOTE' ? 'REMOTA' : 'PRESENCIAL',
            address: displayAddress,
            notes: appointment.comments,
            publicUrl: `${publicUrl}/appointments/${appointment.id}`,
        };

        // 1. To Customer
        await this.mailService.sendAppointmentConfirmationToCustomer(payload);

        // 2. To Technician
        await this.mailService.sendNewAppointmentNotificationToTechnician(payload);
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

    async update(id: string, data: Partial<CreateAppointmentDto>, ip?: string, userAgent?: string) {
        const {
            utm_source,
            utm_medium,
            utm_campaign,
            utm_content,
            utm_term,
            referrer,
            landingPath,
            ...appointmentData
        } = data;

        const appointment = await this.prisma.appointment.update({
            where: { id },
            data: appointmentData as unknown as Prisma.AppointmentUpdateInput,
        });

        // Optional: Log update event
        await this.leadEventsService.createEvent({
            customerId: appointment.customerId,
            leadId: appointment.leadId,
            type: LeadEventType.APPOINTMENT_SCHEDULED, // Or a generic UPDATED event if exists
            metadata: {
                action: 'APPOINTMENT_UPDATED',
                ...data,
            },
            ip,
            userAgent,
        });

        return appointment;
    }
}
