import { ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType, Urgency } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class LeadQueryDto extends PaginationDto {
    @ApiPropertyOptional({ enum: ServiceType })
    @IsEnum(ServiceType)
    @IsOptional()
    serviceType?: ServiceType;

    @ApiPropertyOptional({ enum: Urgency })
    @IsEnum(Urgency)
    @IsOptional()
    urgency?: Urgency;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    customerId?: string;
}
