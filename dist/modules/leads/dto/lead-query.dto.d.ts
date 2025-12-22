import { ServiceType, Urgency, PropertyType } from '@prisma/client';
import { PaginationDto } from '@/common/dto/pagination.dto';
export declare class LeadQueryDto extends PaginationDto {
    serviceType?: ServiceType;
    urgency?: Urgency;
    propertyType?: PropertyType;
    customerId?: string;
}
