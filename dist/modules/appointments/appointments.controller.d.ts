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
                createdAt: Date;
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
        id: string;
        createdAt: Date;
        customerId: string;
        updatedAt: Date;
        date: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        mode: import(".prisma/client").$Enums.AppointmentMode;
        comments: string | null;
        leadId: string | null;
    }>;
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
            id: string;
            createdAt: Date;
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
        id: string;
        createdAt: Date;
        customerId: string;
        updatedAt: Date;
        date: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        mode: import(".prisma/client").$Enums.AppointmentMode;
        comments: string | null;
        leadId: string | null;
    }>;
    update(id: string, data: Partial<CreateAppointmentDto>): Promise<{
        id: string;
        createdAt: Date;
        customerId: string;
        updatedAt: Date;
        date: Date;
        status: import(".prisma/client").$Enums.AppointmentStatus;
        mode: import(".prisma/client").$Enums.AppointmentMode;
        comments: string | null;
        leadId: string | null;
    }>;
}
