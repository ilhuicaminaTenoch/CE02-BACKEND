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
            name: string;
            id: string;
            email: string;
            lastName: string;
            phone: string;
            contactMethod: import(".prisma/client").$Enums.ContactMethod;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    }>;
    findAll(query: LeadQueryDto): Promise<{
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
        } & {
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
        appointments: {
            id: string;
            customerId: string;
            leadId: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            date: Date;
            mode: import(".prisma/client").$Enums.AppointmentMode;
            comments: string | null;
        }[];
    } & {
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
    }>;
    update(id: string, data: Partial<CreateLeadDto>, ip?: string, userAgent?: string): Promise<{
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
    }>;
}
