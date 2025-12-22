import { AppointmentStatus, AppointmentMode } from '@prisma/client';
import { PaginationDto } from '@/common/dto/pagination.dto';
export declare class AppointmentQueryDto extends PaginationDto {
    status?: AppointmentStatus;
    mode?: AppointmentMode;
    customerId?: string;
    leadId?: string;
}
