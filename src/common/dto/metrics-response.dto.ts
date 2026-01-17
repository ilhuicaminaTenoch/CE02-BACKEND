import { ApiProperty } from '@nestjs/swagger';

export class MetricsPeriodDto {
    @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
    currentStart: Date;

    @ApiProperty({ example: '2026-01-17T18:00:00.000Z' })
    currentEnd: Date;

    @ApiProperty({ example: '2025-12-01T00:00:00.000Z' })
    previousStart: Date;

    @ApiProperty({ example: '2025-12-17T18:00:00.000Z' })
    previousEnd: Date;
}

export class MonthOverMonthMetricsDto {
    @ApiProperty({ example: 45 })
    current: number;

    @ApiProperty({ example: 42 })
    previous: number;

    @ApiProperty({ example: 3 })
    change: number;

    @ApiProperty({ example: 7.14 })
    changePct: number | null;

    @ApiProperty({ enum: ['UP', 'DOWN', 'FLAT'], example: 'UP' })
    direction: 'UP' | 'DOWN' | 'FLAT';

    @ApiProperty()
    period: MetricsPeriodDto;
}
