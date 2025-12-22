import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { PaginationDto } from '@/common/dto/pagination.dto';
export declare class CustomersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createCustomerDto: CreateCustomerDto): Promise<{
        addresses: {
            id: string;
            street: string;
            city: string;
            state: string;
            zipCode: string | null;
            noInt: string;
            noExt: string;
            settlement: string;
            createdAt: Date;
            updatedAt: Date;
            references: string | null;
            customerId: string;
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
    }>;
    findAll(query: PaginationDto): Promise<{
        items: ({
            _count: {
                leads: number;
                orders: number;
            };
        } & {
            name: string;
            id: string;
            email: string;
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
            street: string;
            city: string;
            state: string;
            zipCode: string | null;
            noInt: string;
            noExt: string;
            settlement: string;
            createdAt: Date;
            updatedAt: Date;
            references: string | null;
            customerId: string;
        }[];
        leads: {
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
        }[];
        orders: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            subtotal: number;
            total: number;
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
    }>;
    update(id: string, updateDto: Partial<CreateCustomerDto>): Promise<{
        addresses: {
            id: string;
            street: string;
            city: string;
            state: string;
            zipCode: string | null;
            noInt: string;
            noExt: string;
            settlement: string;
            createdAt: Date;
            updatedAt: Date;
            references: string | null;
            customerId: string;
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
    }>;
}
