import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { LeadEventsService } from '../leadevents/leadevents.service';
export declare class AppointmentsService {
    private prisma;
    private mailService;
    private configService;
    private leadEventsService;
    constructor(prisma: PrismaService, mailService: MailService, configService: ConfigService, leadEventsService: LeadEventsService);
    create(createAppointmentDto: CreateAppointmentDto, ip?: string, userAgent?: string): Promise<{
        customer: {
            addresses: {
                id: string;
                street: string;
                city: string;
                state: string;
                zipCode: string | null;
                noInt: string;
                noExt: string;
                settlement: string;
                customerId: string;
                createdAt: Date;
                updatedAt: Date;
                references: string | null;
            }[];
        } & {
            name: string;
            id: string;
            email: string;
            lastName: string;
            phone: string;
            contactMethod: import(".prisma/client").$Enums.ContactMethod;
            createdAt: Date;
            updatedAt: Date;
        };
        lead: {
            description: string;
            id: string;
            customerId: string;
            createdAt: Date;
            updatedAt: Date;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            budgetEstimated: string | null;
            urgency: import(".prisma/client").$Enums.Urgency;
            propertyType: import(".prisma/client").$Enums.PropertyType;
            numCameras: number | null;
            numAccessPoints: number | null;
        };
    } & {
        id: string;
        customerId: string;
        leadId: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        date: Date;
        mode: import(".prisma/client").$Enums.AppointmentMode;
        comments: string | null;
    }>;
    private sendEmails;
    findAll(query: AppointmentQueryDto): Promise<{
        items: ({
            customer: {
                name: string;
                id: string;
                email: string;
                lastName: string;
                phone: string;
                contactMethod: import(".prisma/client").$Enums.ContactMethod;
                createdAt: Date;
                updatedAt: Date;
            };
            lead: {
                description: string;
                id: string;
                customerId: string;
                createdAt: Date;
                updatedAt: Date;
                serviceType: import(".prisma/client").$Enums.ServiceType;
                budgetEstimated: string | null;
                urgency: import(".prisma/client").$Enums.Urgency;
                propertyType: import(".prisma/client").$Enums.PropertyType;
                numCameras: number | null;
                numAccessPoints: number | null;
            };
        } & {
            id: string;
            customerId: string;
            leadId: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            date: Date;
            mode: import(".prisma/client").$Enums.AppointmentMode;
            comments: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        customer: {
            name: string;
            id: string;
            email: string;
            lastName: string;
            phone: string;
            contactMethod: import(".prisma/client").$Enums.ContactMethod;
            createdAt: Date;
            updatedAt: Date;
        };
        lead: {
            description: string;
            id: string;
            customerId: string;
            createdAt: Date;
            updatedAt: Date;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            budgetEstimated: string | null;
            urgency: import(".prisma/client").$Enums.Urgency;
            propertyType: import(".prisma/client").$Enums.PropertyType;
            numCameras: number | null;
            numAccessPoints: number | null;
        };
    } & {
        id: string;
        customerId: string;
        leadId: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        date: Date;
        mode: import(".prisma/client").$Enums.AppointmentMode;
        comments: string | null;
    }>;
    update(id: string, data: Partial<CreateAppointmentDto>): Promise<{
        id: string;
        customerId: string;
        leadId: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        date: Date;
        mode: import(".prisma/client").$Enums.AppointmentMode;
        comments: string | null;
    }>;
}
