import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
export declare class AppointmentsService {
    private prisma;
    private mailService;
    private configService;
    constructor(prisma: PrismaService, mailService: MailService, configService: ConfigService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<{
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            lastName: string;
            phone: string;
            contactMethod: import(".prisma/client").$Enums.ContactMethod;
        };
        lead: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            description: string;
            budgetEstimated: string | null;
            urgency: import(".prisma/client").$Enums.Urgency;
            propertyType: import(".prisma/client").$Enums.PropertyType;
            numCameras: number | null;
            numAccessPoints: number | null;
        };
    } & {
        id: string;
        date: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        mode: import(".prisma/client").$Enums.AppointmentMode;
        comments: string | null;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        leadId: string | null;
    }>;
    private sendEmails;
    findAll(query: AppointmentQueryDto): Promise<{
        items: ({
            customer: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                email: string;
                lastName: string;
                phone: string;
                contactMethod: import(".prisma/client").$Enums.ContactMethod;
            };
            lead: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                customerId: string;
                serviceType: import(".prisma/client").$Enums.ServiceType;
                description: string;
                budgetEstimated: string | null;
                urgency: import(".prisma/client").$Enums.Urgency;
                propertyType: import(".prisma/client").$Enums.PropertyType;
                numCameras: number | null;
                numAccessPoints: number | null;
            };
        } & {
            id: string;
            date: Date;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            mode: import(".prisma/client").$Enums.AppointmentMode;
            comments: string | null;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            leadId: string | null;
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
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            lastName: string;
            phone: string;
            contactMethod: import(".prisma/client").$Enums.ContactMethod;
        };
        lead: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            description: string;
            budgetEstimated: string | null;
            urgency: import(".prisma/client").$Enums.Urgency;
            propertyType: import(".prisma/client").$Enums.PropertyType;
            numCameras: number | null;
            numAccessPoints: number | null;
        };
    } & {
        id: string;
        date: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        mode: import(".prisma/client").$Enums.AppointmentMode;
        comments: string | null;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        leadId: string | null;
    }>;
    update(id: string, data: Partial<CreateAppointmentDto>): Promise<{
        id: string;
        date: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        mode: import(".prisma/client").$Enums.AppointmentMode;
        comments: string | null;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        leadId: string | null;
    }>;
}
