import { Controller, Get, Post, Body, Param, Query, Patch, NotFoundException, Ip, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentQueryDto } from './dto/appointment-query.dto';
import { Public } from '@/common/decorators/public.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole, AppointmentStatus, AppointmentMode } from '@prisma/client';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { MonthOverMonthMetricsDto } from '@/common/dto/metrics-response.dto';

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

    @Get('metrics/month-over-month')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get appointment metrics comparing current month vs previous month (ADMIN only)' })
    @ApiQuery({ name: 'status', enum: AppointmentStatus, required: false, description: 'Filter by appointment status' })
    @ApiQuery({ name: 'mode', enum: AppointmentMode, required: false, description: 'Filter by appointment mode' })
    @ApiQuery({ name: 'tzOffsetMinutes', required: false, type: Number, description: 'Timezone offset in minutes (e.g. 360 for UTC-6)' })
    @ApiOkResponse({ type: MonthOverMonthMetricsDto })
    getMonthOverMonthMetrics(
        @Query('status') status?: AppointmentStatus,
        @Query('mode') mode?: AppointmentMode,
        @Query('tzOffsetMinutes') tzOffsetMinutes?: string,
    ) {
        return this.appointmentsService.getMonthOverMonthMetrics(
            status,
            mode,
            tzOffsetMinutes ? parseInt(tzOffsetMinutes, 10) : 0,
        );
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
