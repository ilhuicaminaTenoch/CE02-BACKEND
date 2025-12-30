import { Controller, Get, Post, Body, Param, Query, Patch, NotFoundException, Ip, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    @ApiOperation({ summary: 'Schedule a new appointment' })
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
