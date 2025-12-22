import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaService } from '@/common/prisma/prisma.service';
import { MailModule } from '../mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [MailModule, ConfigModule],
    controllers: [AppointmentsController],
    providers: [AppointmentsService, PrismaService],
})
export class AppointmentsModule { }
