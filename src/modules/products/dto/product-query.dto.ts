import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class ProductQueryDto extends PaginationDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    category?: string;
}
