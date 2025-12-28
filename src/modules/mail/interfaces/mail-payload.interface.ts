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

export interface OrderQuoteEmailPayload {
    logo: string;
    orderId: string;
    date: string;
    validUntil: string;
    customerFullname: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    items: {
        name: string;
        quantity: number;
        unitPriceFormatted: string;
        lineTotalFormatted: string;
    }[];
    subtotalFormatted: string;
    taxFormatted: string;
    totalFormatted: string;
}
