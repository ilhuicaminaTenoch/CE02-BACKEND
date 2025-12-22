import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus, AppointmentMode } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
    @ApiProperty({ example: '2025-12-24T10:00:00Z' })
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @ApiPropertyOptional({ enum: AppointmentStatus, default: AppointmentStatus.SCHEDULED })
    @IsEnum(AppointmentStatus)
    @IsOptional()
    status?: AppointmentStatus;

    @ApiProperty({ enum: AppointmentMode, default: AppointmentMode.IN_PERSON })
    @IsEnum(AppointmentMode)
    @IsOptional()
    mode?: AppointmentMode;

    @ApiPropertyOptional({ example: 'Cliente solicita revisión de cámaras en patio.' })
    @IsString()
    @IsOptional()
    comments?: string;

    @ApiProperty({ example: 'uuid-of-customer' })
    @IsUUID()
    @IsNotEmpty()
    customerId: string;

    @ApiPropertyOptional({ example: 'uuid-of-lead' })
    @IsUUID()
    @IsOptional()
    leadId?: string;
}
