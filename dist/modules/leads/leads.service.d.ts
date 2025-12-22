import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';
export declare class LeadsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createLeadDto: CreateLeadDto): Promise<{
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
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
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
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
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
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            date: Date;
            mode: import(".prisma/client").$Enums.AppointmentMode;
            comments: string | null;
            leadId: string | null;
        }[];
    } & {
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        budgetEstimated: string | null;
        urgency: import(".prisma/client").$Enums.Urgency;
        propertyType: import(".prisma/client").$Enums.PropertyType;
        numCameras: number | null;
        numAccessPoints: number | null;
    }>;
    update(id: string, data: Partial<CreateLeadDto>): Promise<{
        description: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        serviceType: import(".prisma/client").$Enums.ServiceType;
        budgetEstimated: string | null;
        urgency: import(".prisma/client").$Enums.Urgency;
        propertyType: import(".prisma/client").$Enums.PropertyType;
        numCameras: number | null;
        numAccessPoints: number | null;
    }>;
}
