import { ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import {IsEnum, IsOptional, IsString, IsUUID} from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class OrderQueryDto extends PaginationDto {
    @ApiPropertyOptional({ enum: OrderStatus })
    @IsEnum(OrderStatus)
    @IsOptional()
    status?: OrderStatus;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    customerId?: string;

    @ApiPropertyOptional({ description: 'Search by customer name / lastName' })
    @IsString()
    @IsOptional()
    search?: string;
}
