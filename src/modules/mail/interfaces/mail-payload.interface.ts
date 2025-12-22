export interface AppointmentEmailPayload {
    appointmentId: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    serviceType?: string;
    dateTimeISO: string;
    dateTimeFormatted: string;
    modality: string;
    address?: string;
    notes?: string;
    publicUrl: string;
}
