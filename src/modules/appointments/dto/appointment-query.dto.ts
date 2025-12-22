import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus, AppointmentMode } from '@prisma/client';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class AppointmentQueryDto extends PaginationDto {
    @ApiPropertyOptional({ enum: AppointmentStatus })
    @IsEnum(AppointmentStatus)
    @IsOptional()
    status?: AppointmentStatus;

    @ApiPropertyOptional({ enum: AppointmentMode })
    @IsEnum(AppointmentMode)
    @IsOptional()
    mode?: AppointmentMode;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    customerId?: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    leadId?: string;
}
