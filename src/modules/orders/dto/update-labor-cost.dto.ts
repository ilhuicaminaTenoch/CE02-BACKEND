import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateLaborCostDto {
    @ApiProperty({
        description: 'Labor cost (MXN), can be 0. Null or undefined means value is still pending.',
        example: 1250.50,
        required: true,
    })
    @IsNumber()
    @Min(0)
    laborCost: number;
}
