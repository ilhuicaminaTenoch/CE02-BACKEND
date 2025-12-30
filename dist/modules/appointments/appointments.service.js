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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const client_1 = require("@prisma/client");
const mail_service_1 = require("../mail/mail.service");
const config_1 = require("@nestjs/config");
const leadevents_service_1 = require("../leadevents/leadevents.service");
let AppointmentsService = class AppointmentsService {
    constructor(prisma, mailService, configService, leadEventsService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.configService = configService;
        this.leadEventsService = leadEventsService;
    }
    async create(createAppointmentDto, ip, userAgent) {
        const appointment = await this.prisma.appointment.create({
            data: createAppointmentDto,
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
        await this.leadEventsService.createEvent({
            customerId: appointment.customerId,
            leadId: appointment.leadId,
            type: client_1.LeadEventType.APPOINTMENT_SCHEDULED,
            metadata: {
                date: appointment.date,
                mode: appointment.mode,
            },
            ip,
            userAgent,
        });
        this.sendEmails(appointment).catch(err => {
            console.error('Error in sendEmails background task:', err);
        });
        return appointment;
    }
    async sendEmails(appointment) {
        const publicUrl = this.configService.get('APP_PUBLIC_URL', 'http://localhost:3000');
        let displayAddress = 'Consulte el panel técnico';
        if (appointment.mode === 'REMOTE') {
            displayAddress = 'N/A (Cita Remota)';
        }
        else if (appointment.customer.addresses && appointment.customer.addresses.length > 0) {
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
        await this.mailService.sendAppointmentConfirmationToCustomer(payload);
        await this.mailService.sendNewAppointmentNotificationToTechnician(payload);
    }
    async findAll(query) {
        const { page, limit, status, mode, customerId, leadId, search } = query;
        const skip = (page - 1) * limit;
        const where = {
            ...(status && { status }),
            ...(mode && { mode }),
            ...(customerId && { customerId }),
            ...(leadId && { leadId }),
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
    async findOne(id) {
        return this.prisma.appointment.findUnique({
            where: { id },
            include: { customer: true, lead: true },
        });
    }
    async update(id, data) {
        return this.prisma.appointment.update({
            where: { id },
            data,
        });
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        config_1.ConfigService,
        leadevents_service_1.LeadEventsService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map