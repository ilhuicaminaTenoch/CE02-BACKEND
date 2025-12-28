import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class AddItemDto {
    @ApiProperty({ example: 'uuid-of-product' })
    @IsNotEmpty()
    productId: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({ example: 'uuid-of-customer' })
    @IsUUID()
    @IsNotEmpty()
    customerId: string;
}

export class UpdateItemDto {
    @ApiProperty({ example: 2 })
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    quantity: number;
}
