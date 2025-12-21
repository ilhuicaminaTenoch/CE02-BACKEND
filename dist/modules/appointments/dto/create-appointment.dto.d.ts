import { AppointmentStatus } from '@prisma/client';
export declare class CreateAppointmentDto {
    date: string;
    status?: AppointmentStatus;
    customerId: string;
    leadId?: string;
    orderId?: string;
}
