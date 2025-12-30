import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsOptional, IsArray, ValidateNested, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    productId: string;

    @ApiProperty()
    @IsInt()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    customerId: string;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    leadId?: string;

    @ApiProperty({ type: [OrderItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}
