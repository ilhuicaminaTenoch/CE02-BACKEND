import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaService } from '@/common/prisma/prisma.service';

@Module({
    controllers: [AppointmentsController],
    providers: [AppointmentsService, PrismaService],
})
export class AppointmentsModule { }
