import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
    @ApiProperty({ example: '2025-12-24T10:00:00Z' })
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @ApiPropertyOptional({ enum: AppointmentStatus, default: AppointmentStatus.SCHEDULED })
    @IsEnum(AppointmentStatus)
    @IsOptional()
    status?: AppointmentStatus;

    @ApiProperty({ example: 'uuid-of-customer' })
    @IsUUID()
    @IsNotEmpty()
    customerId: string;

    @ApiPropertyOptional({ example: 'uuid-of-lead' })
    @IsUUID()
    @IsOptional()
    leadId?: string;

    @ApiPropertyOptional({ example: 'uuid-of-order' })
    @IsUUID()
    @IsOptional()
    orderId?: string;
}
