import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './modules/health/health.controller';
import { PrismaService } from './common/prisma/prisma.service';
import { ProductsModule } from './modules/products/products.module';
import { CustomersModule } from './modules/customers/customers.module';
import { LeadsModule } from './modules/leads/leads.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { OrdersModule } from './modules/orders/orders.module';
import { SyscomModule } from './modules/syscom/syscom.module';
import { LeadEventsModule } from './modules/leadevents/leadevents.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
        }),
        SyscomModule,
        ProductsModule,
        CustomersModule,
        LeadsModule,
        AppointmentsModule,
        OrdersModule,
        LeadEventsModule,
    ],
    controllers: [HealthController],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class AppModule { }
