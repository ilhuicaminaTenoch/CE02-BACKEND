"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAppointmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateAppointmentDto {
}
exports.CreateAppointmentDto = CreateAppointmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-12-24T10:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: client_1.AppointmentStatus, default: client_1.AppointmentStatus.SCHEDULED }),
    (0, class_validator_1.IsEnum)(client_1.AppointmentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.AppointmentMode, default: client_1.AppointmentMode.IN_PERSON }),
    (0, class_validator_1.IsEnum)(client_1.AppointmentMode),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "mode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Cliente solicita revisión de cámaras en patio.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-customer' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-of-lead' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "leadId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'google' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "utm_source", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'summer_sale' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "utm_campaign", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'email' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "utm_medium", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'video_ad' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "utm_content", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'cctv_mexico' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "utm_term", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'https://google.com' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "referrer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/lighting-promo' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAppointmentDto.prototype, "landingPath", void 0);
//# sourceMappingURL=create-appointment.dto.js.map