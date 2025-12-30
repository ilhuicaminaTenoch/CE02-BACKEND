import { ServiceType, Urgency, PropertyType } from '@prisma/client';
export declare class CreateLeadDto {
    serviceType: ServiceType;
    description: string;
    budgetEstimated?: string;
    urgency?: Urgency;
    propertyType: PropertyType;
    numCameras?: number;
    numAccessPoints?: number;
    customerId: string;
    utm_source?: string;
    utm_campaign?: string;
    utm_medium?: string;
    utm_content?: string;
    utm_term?: string;
    referrer?: string;
    landingPath?: string;
}
