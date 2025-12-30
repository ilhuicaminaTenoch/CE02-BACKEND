import { Controller, Get, Post, Body, Param, Query, Patch, NotFoundException, Ip, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadQueryDto } from './dto/lead-query.dto';

@ApiTags('Leads')
@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new lead' })
    create(
        @Body() createLeadDto: CreateLeadDto,
        @Ip() ip: string,
        @Headers('user-agent') userAgent: string,
    ) {
        return this.leadsService.create(createLeadDto, ip, userAgent);
    }

    @Get()
    @ApiOperation({ summary: 'List leads with filtering and pagination' })
    findAll(@Query() query: LeadQueryDto) {
        return this.leadsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get lead by ID' })
    async findOne(@Param('id') id: string) {
        const lead = await this.leadsService.findOne(id);
        if (!lead) throw new NotFoundException('Lead not found');
        return lead;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update lead data' })
    update(
        @Param('id') id: string,
        @Body() data: Partial<CreateLeadDto>,
        @Ip() ip: string,
        @Headers('user-agent') userAgent: string,
    ) {
        return this.leadsService.update(id, data, ip, userAgent);
    }
}
