import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaService } from '@/common/prisma/prisma.service';
import { MailModule } from '../mail/mail.module';

@Module({
    imports: [MailModule],
    controllers: [OrdersController],
    providers: [OrdersService, PrismaService],
})
export class OrdersModule { }
