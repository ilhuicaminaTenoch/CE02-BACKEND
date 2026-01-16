import { ApiProperty } from '@nestjs/swagger';

export class DashboardMetricDto {
    @ApiProperty({ example: 124 })
    value: number;

    @ApiProperty({ example: 110 })
    previousValue: number;

    @ApiProperty({ example: 12 })
    changePct: number;

    @ApiProperty({ example: 'UP', enum: ['UP', 'DOWN', 'FLAT'] })
    trend: 'UP' | 'DOWN' | 'FLAT';
}
