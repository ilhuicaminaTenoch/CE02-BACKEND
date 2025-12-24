import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    create(createAppointmentDto: CreateAppointmentDto): Promise<{
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
        };
        lead: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        date: Date;
        mode: import(".prisma/client").$Enums.AppointmentMode;
        comments: string | null;
        leadId: string | null;
    }>;
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
                createdAt: Date;
                updatedAt: Date;
                customerId: string;
                serviceType: import(".prisma/client").$Enums.ServiceType;
                budgetEstimated: string | null;
                urgency: import(".prisma/client").$Enums.Urgency;
                propertyType: import(".prisma/client").$Enums.PropertyType;
                numCameras: number | null;
                numAccessPoints: number | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            status: import(".prisma/client").$Enums.AppointmentStatus;
            date: Date;
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
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            serviceType: import(".prisma/client").$Enums.ServiceType;
            budgetEstimated: string | null;
            urgency: import(".prisma/client").$Enums.Urgency;
            propertyType: import(".prisma/client").$Enums.PropertyType;
            numCameras: number | null;
            numAccessPoints: number | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        date: Date;
        mode: import(".prisma/client").$Enums.AppointmentMode;
        comments: string | null;
        leadId: string | null;
    }>;
    update(id: string, data: Partial<CreateAppointmentDto>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        date: Date;
        mode: import(".prisma/client").$Enums.AppointmentMode;
        comments: string | null;
        leadId: string | null;
    }>;
}
