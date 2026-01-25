import { ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus, AppointmentMode } from '@prisma/client';
import {IsEnum, IsOptional, IsString, IsUUID} from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';
import {Transform} from "class-transformer";

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

    @ApiPropertyOptional({
        description: 'Busca por nombre, apellido, email o teléfono del cliente',
        example: 'juan perez / 5534789809 / juan@mail.com',
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    search?: string;
}
