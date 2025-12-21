import { OrderStatus } from '@prisma/client';
import { PaginationDto } from '@/common/dto/pagination.dto';
export declare class OrderQueryDto extends PaginationDto {
    status?: OrderStatus;
    customerId?: string;
}
