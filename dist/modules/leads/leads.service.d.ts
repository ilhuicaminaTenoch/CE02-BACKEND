import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
import { LeadEventsService } from '../leadevents/leadevents.service';
export declare class LeadsService {
    private prisma;
    private leadEventsService;
    constructor(prisma: PrismaService, leadEventsService: LeadEventsService);
    create(createLeadDto: CreateLeadDto, ip?: string, userAgent?: string): Promise<{
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
    } & {
        serviceType: import(".prisma/client").$Enums.ServiceType;
        description: string;
        budgetEstimated: string | null;
        urgency: import(".prisma/client").$Enums.Urgency;
        propertyType: import(".prisma/client").$Enums.PropertyType;
        numCameras: number | null;
        numAccessPoints: number | null;
        customerId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(query: LeadQueryDto): Promise<{
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
        } & {
            serviceType: import(".prisma/client").$Enums.ServiceType;
            description: string;
            budgetEstimated: string | null;
            urgency: import(".prisma/client").$Enums.Urgency;
            propertyType: import(".prisma/client").$Enums.PropertyType;
            numCameras: number | null;
            numAccessPoints: number | null;
            customerId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
        appointments: {
            customerId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            date: Date;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            leadId: string | null;
            mode: import(".prisma/client").$Enums.AppointmentMode;
            comments: string | null;
        }[];
    } & {
        serviceType: import(".prisma/client").$Enums.ServiceType;
        description: string;
        budgetEstimated: string | null;
        urgency: import(".prisma/client").$Enums.Urgency;
        propertyType: import(".prisma/client").$Enums.PropertyType;
        numCameras: number | null;
        numAccessPoints: number | null;
        customerId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, data: Partial<CreateLeadDto>, ip?: string, userAgent?: string): Promise<{
        serviceType: import(".prisma/client").$Enums.ServiceType;
        description: string;
        budgetEstimated: string | null;
        urgency: import(".prisma/client").$Enums.Urgency;
        propertyType: import(".prisma/client").$Enums.PropertyType;
        numCameras: number | null;
        numAccessPoints: number | null;
        customerId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
