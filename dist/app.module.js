"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const health_controller_1 = require("./modules/health/health.controller");
const prisma_service_1 = require("./common/prisma/prisma.service");
const products_module_1 = require("./modules/products/products.module");
const customers_module_1 = require("./modules/customers/customers.module");
const leads_module_1 = require("./modules/leads/leads.module");
const appointments_module_1 = require("./modules/appointments/appointments.module");
const orders_module_1 = require("./modules/orders/orders.module");
const syscom_module_1 = require("./modules/syscom/syscom.module");
const leadevents_module_1 = require("./modules/leadevents/leadevents.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env'],
            }),
            syscom_module_1.SyscomModule,
            products_module_1.ProductsModule,
            customers_module_1.CustomersModule,
            leads_module_1.LeadsModule,
            appointments_module_1.AppointmentsModule,
            orders_module_1.OrdersModule,
            leadevents_module_1.LeadEventsModule,
        ],
        controllers: [health_controller_1.HealthController],
        providers: [prisma_service_1.PrismaService],
        exports: [prisma_service_1.PrismaService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map