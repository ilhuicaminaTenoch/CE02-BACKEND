import { AppointmentStatus, AppointmentMode } from '@prisma/client';
export declare class CreateAppointmentDto {
    date: string;
    status?: AppointmentStatus;
    mode?: AppointmentMode;
    comments?: string;
    customerId: string;
    leadId?: string;
    utm_source?: string;
    utm_campaign?: string;
    utm_medium?: string;
    utm_content?: string;
    utm_term?: string;
    referrer?: string;
    landingPath?: string;
}
