import { ServiceType, Urgency, PropertyType } from '@prisma/client';
export declare class CreateLeadDto {
    serviceType: ServiceType;
    description: string;
    budgetEstimated?: number;
    urgency?: Urgency;
    propertyType: PropertyType;
    numCameras?: number;
    numAccessPoints?: number;
    customerId: string;
}
