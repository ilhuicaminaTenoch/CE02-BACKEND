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

    @ApiPropertyOptional({ example: 'google' })
    @IsOptional()
    @IsString()
    utm_source?: string;

    @ApiPropertyOptional({ example: 'summer_sale' })
    @IsOptional()
    @IsString()
    utm_campaign?: string;

    @ApiPropertyOptional({ example: 'email' })
    @IsOptional()
    @IsString()
    utm_medium?: string;

    @ApiPropertyOptional({ example: 'video_ad' })
    @IsOptional()
    @IsString()
    utm_content?: string;

    @ApiPropertyOptional({ example: 'cctv_mexico' })
    @IsOptional()
    @IsString()
    utm_term?: string;

    @ApiPropertyOptional({ example: 'https://google.com' })
    @IsOptional()
    @IsString()
    referrer?: string;

    @ApiPropertyOptional({ example: '/lighting-promo' })
    @IsOptional()
    @IsString()
    landingPath?: string;
}
