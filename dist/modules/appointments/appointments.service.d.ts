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
            addresses: {
                createdAt: Date;
                id: string;
                street: string;
                noInt: string;
                noExt: string;
                settlement: string;
                city: string;
                state: string;
                zipCode: string | null;
                references: string | null;
                customerId: string;
                updatedAt: Date;
            }[];
        } & {
            createdAt: Date;
            id: string;
            updatedAt: Date;
            name: string;
            email: string;
            lastName: string;
            phone: string;
            contactMethod: import(".prisma/client").$Enums.ContactMethod;
        };
        lead: {
            createdAt: Date;
            id: string;
            customerId: string;
            updatedAt: Date;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            description: string;
            budgetEstimated: string | null;
            urgency: import(".prisma/client").$Enums.Urgency;
            propertyType: import(".prisma/client").$Enums.PropertyType;
            numCameras: number | null;
            numAccessPoints: number | null;
        };
    } & {
        createdAt: Date;
        id: string;
        customerId: string;
        updatedAt: Date;
        date: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        mode: import(".prisma/client").$Enums.AppointmentMode;
        comments: string | null;
        leadId: string | null;
    }>;
    private sendEmails;
    findAll(query: AppointmentQueryDto): Promise<{
        items: ({
            customer: {
                createdAt: Date;
                id: string;
                updatedAt: Date;
                name: string;
                email: string;
                lastName: string;
                phone: string;
                contactMethod: import(".prisma/client").$Enums.ContactMethod;
            };
            lead: {
                createdAt: Date;
                id: string;
                customerId: string;
                updatedAt: Date;
                serviceType: import(".prisma/client").$Enums.ServiceType;
                description: string;
                budgetEstimated: string | null;
                urgency: import(".prisma/client").$Enums.Urgency;
                propertyType: import(".prisma/client").$Enums.PropertyType;
                numCameras: number | null;
                numAccessPoints: number | null;
            };
        } & {
            createdAt: Date;
            id: string;
            customerId: string;
            updatedAt: Date;
            date: Date;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            mode: import(".prisma/client").$Enums.AppointmentMode;
            comments: string | null;
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
            createdAt: Date;
            id: string;
            updatedAt: Date;
            name: string;
            email: string;
            lastName: string;
            phone: string;
            contactMethod: import(".prisma/client").$Enums.ContactMethod;
        };
        lead: {
            createdAt: Date;
            id: string;
            customerId: string;
            updatedAt: Date;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            description: string;
            budgetEstimated: string | null;
            urgency: import(".prisma/client").$Enums.Urgency;
            propertyType: import(".prisma/client").$Enums.PropertyType;
            numCameras: number | null;
            numAccessPoints: number | null;
        };
    } & {
        createdAt: Date;
        id: string;
        customerId: string;
        updatedAt: Date;
        date: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        mode: import(".prisma/client").$Enums.AppointmentMode;
        comments: string | null;
        leadId: string | null;
    }>;
    update(id: string, data: Partial<CreateAppointmentDto>): Promise<{
        createdAt: Date;
        id: string;
        customerId: string;
        updatedAt: Date;
        date: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        mode: import(".prisma/client").$Enums.AppointmentMode;
        comments: string | null;
        leadId: string | null;
    }>;
}
