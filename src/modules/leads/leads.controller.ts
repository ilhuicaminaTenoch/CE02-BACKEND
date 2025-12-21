import { Controller, Get, Post, Body, Param, Query, Patch, NotFoundException } from '@nestjs/common';
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
    create(@Body() createLeadDto: CreateLeadDto) {
        return this.leadsService.create(createLeadDto);
    }

    @Get()
    @ApiOperation({ summary: 'List leads with filters and pagination' })
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
    update(@Param('id') id: string, @Body() data: Partial<CreateLeadDto>) {
        return this.leadsService.update(id, data);
    }
}
