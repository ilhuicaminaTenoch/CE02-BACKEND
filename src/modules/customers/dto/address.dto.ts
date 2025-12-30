import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Expose, Transform } from 'class-transformer';

export class CreateAddressDto {
    @ApiProperty({ example: 'Av. Reforma 123' })
    @IsString()
    @IsNotEmpty()
    street: string;

    @ApiProperty({ example: 'CDMX' })
    @IsString()
    @IsNotEmpty()
    city: string;

    @ApiProperty({ example: 'Coyoacán' })
    @IsString()
    @IsNotEmpty()
    state: string;

    @ApiPropertyOptional({ example: '04000' })
    @IsString()
    @IsOptional()
    @Matches(/^\d{5}$/, { message: 'El código postal debe contener 5 dígitos.' })
    zipCode?: string;

    @ApiProperty({ example: '123' })
    @IsString()
    @IsNotEmpty()
    noInt: string;

    @ApiProperty({ example: 'lt 24', name: 'noExt', required: false })
    @IsString()
    @IsOptional()
    @Transform(({ value, obj }) => value || obj.NoExt)
    noExt: string;

    @ApiPropertyOptional({ example: 'lt 24' })
    @IsString()
    @IsOptional()
    NoExt?: string;

    @ApiProperty({ example: 'Colonia Centro' })
    @IsString()
    @IsNotEmpty()
    settlement: string;
}
