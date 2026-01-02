import { Controller, Get, Post, Body, Param, Query, Patch, NotFoundException, Ip, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Appointments')
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Public()
    @Post()
    @ApiOperation({ summary: 'Schedule a new appointment (Public for Funnel)' })
    create(
        @Body() createAppointmentDto: CreateAppointmentDto,
        @Ip() ip: string,
        @Headers('user-agent') userAgent: string,
    ) {
        return this.appointmentsService.create(createAppointmentDto, ip, userAgent);
    }

    @Get()
    @ApiOperation({ summary: 'List appointments with filtering and pagination' })
    findAll(@Query() query: AppointmentQueryDto) {
        return this.appointmentsService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get appointment by ID' })
    async findOne(@Param('id') id: string) {
        const appointment = await this.appointmentsService.findOne(id);
        if (!appointment) throw new NotFoundException('Appointment not found');
        return appointment;
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update appointment (e.g. status or date)' })
    update(
        @Param('id') id: string,
        @Body() data: Partial<CreateAppointmentDto>,
        @Ip() ip: string,
        @Headers('user-agent') userAgent: string,
    ) {
        return this.appointmentsService.update(id, data, ip, userAgent);
    }
}
