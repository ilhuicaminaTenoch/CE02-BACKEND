import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { LeadEventsService } from '../leadevents/leadevents.service';
export declare class CustomersService {
    private prisma;
    private leadEventsService;
    constructor(prisma: PrismaService, leadEventsService: LeadEventsService);
    create(createCustomerDto: CreateCustomerDto, ip?: string, userAgent?: string): Promise<{
        addresses: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            street: string;
            noInt: string;
            noExt: string;
            settlement: string;
            city: string;
            state: string;
            zipCode: string | null;
            references: string | null;
            customerId: string;
        }[];
    } & {
        id: string;
        email: string;
        name: string;
        lastName: string;
        phone: string;
        contactMethod: import(".prisma/client").$Enums.ContactMethod;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(query: PaginationDto): Promise<{
        items: ({
            _count: {
                leads: number;
                orders: number;
            };
        } & {
            id: string;
            email: string;
            name: string;
            lastName: string;
            phone: string;
            contactMethod: import(".prisma/client").$Enums.ContactMethod;
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
        addresses: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            street: string;
            noInt: string;
            noExt: string;
            settlement: string;
            city: string;
            state: string;
            zipCode: string | null;
            references: string | null;
            customerId: string;
        }[];
        leads: {
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
        }[];
        orders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            subtotal: number;
            total: number;
            leadId: string | null;
        }[];
    } & {
        id: string;
        email: string;
        name: string;
        lastName: string;
        phone: string;
        contactMethod: import(".prisma/client").$Enums.ContactMethod;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateDto: Partial<CreateCustomerDto>): Promise<{
        addresses: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            street: string;
            noInt: string;
            noExt: string;
            settlement: string;
            city: string;
            state: string;
            zipCode: string | null;
            references: string | null;
            customerId: string;
        }[];
    } & {
        id: string;
        email: string;
        name: string;
        lastName: string;
        phone: string;
        contactMethod: import(".prisma/client").$Enums.ContactMethod;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
