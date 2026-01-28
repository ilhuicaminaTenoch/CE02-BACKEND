import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { HealthController } from './modules/health/health.controller';
import { PrismaService } from './common/prisma/prisma.service';
import { ProductsModule } from './modules/products/products.module';
import { CustomersModule } from './modules/customers/customers.module';
import { LeadsModule } from './modules/leads/leads.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { OrdersModule } from './modules/orders/orders.module';
import { SyscomModule } from './modules/syscom/syscom.module';
import { LeadEventsModule } from './modules/leadevents/leadevents.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env'],
        }),
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 60,
        }]),
        ScheduleModule.forRoot(),
        SyscomModule,
        ProductsModule,
        CustomersModule,
        LeadsModule,
        AppointmentsModule,
        OrdersModule,
        LeadEventsModule,
        UsersModule,
        AuthModule,
    ],
    controllers: [HealthController],
    providers: [
        PrismaService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: [PrismaService],
})
export class AppModule { }
