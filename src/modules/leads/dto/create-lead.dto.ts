import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType, Urgency, PropertyType } from '@prisma/client';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateLeadDto {
    @ApiProperty({ enum: ServiceType })
    @IsEnum(ServiceType)
    @IsNotEmpty()
    serviceType: ServiceType;

    @ApiProperty({ example: 'Instalación de 4 cámaras 4K en patio y entrada.' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiPropertyOptional({ example: '$5000-$15000' })
    @IsString()
    @IsOptional()
    budgetEstimated?: string;

    @ApiPropertyOptional({ enum: Urgency, default: Urgency.MEDIUM })
    @IsEnum(Urgency)
    @IsOptional()
    urgency?: Urgency;

    @ApiProperty({ enum: PropertyType })
    @IsEnum(PropertyType)
    @IsNotEmpty()
    propertyType: PropertyType;

    @ApiPropertyOptional({ example: 4 })
    @IsInt()
    @Min(0)
    @IsOptional()
    numCameras?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsInt()
    @Min(0)
    @IsOptional()
    numAccessPoints?: number;

    @ApiProperty({ example: 'uuid-of-customer' })
    @IsUUID()
    @IsNotEmpty()
    customerId: string;

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
