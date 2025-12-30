import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, ValidateNested, Matches } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreateAddressDto } from './address.dto';

export type ContactMethod = 'WHATSAPP' | 'CALL' | 'EMAIL';

export class CreateCustomerDto {
    @ApiProperty({ example: 'juan.perez@example.com' })
    @IsEmail()
    @IsNotEmpty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value)
    email: string;

    @ApiProperty({ example: 'Juan' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Pérez' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: '+525512345678' })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => {
        if (typeof value !== 'string') return value;
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.startsWith('521') && cleaned.length === 13) return cleaned.slice(3);
        if (cleaned.startsWith('52') && cleaned.length === 12) return cleaned.slice(2);
        return cleaned;
    })
    @IsString({ message: 'El teléfono debe contener 10 dígitos numéricos.' })
    @IsNotEmpty({ message: 'El teléfono debe contener 10 dígitos numéricos.' })
    @Matches(/^\d{10}$/, { message: 'El teléfono debe contener 10 dígitos numéricos.' })
    phone: string;

    @ApiProperty({
        example: 'WHATSAPP',
        enum: ['WHATSAPP', 'CALL', 'EMAIL'],
        description: 'Método de contacto preferido',
    })
    @IsNotEmpty()
    @IsIn(['WHATSAPP', 'CALL', 'EMAIL'])
    contactMethod: ContactMethod;

    @ApiPropertyOptional({ type: [CreateAddressDto] })
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => CreateAddressDto)
    addresses?: CreateAddressDto[];

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

