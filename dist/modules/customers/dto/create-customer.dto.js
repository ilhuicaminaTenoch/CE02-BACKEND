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
exports.CreateCustomerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const address_dto_1 = require("./address.dto");
class CreateCustomerDto {
}
exports.CreateCustomerDto = CreateCustomerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'juan.perez@example.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => typeof value === 'string' ? value.trim().toLowerCase() : value),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Juan' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Pérez' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '+525512345678' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (typeof value !== 'string')
            return value;
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.startsWith('521') && cleaned.length === 13)
            return cleaned.slice(3);
        if (cleaned.startsWith('52') && cleaned.length === 12)
            return cleaned.slice(2);
        return cleaned;
    }),
    (0, class_validator_1.IsString)({ message: 'El teléfono debe contener 10 dígitos numéricos.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El teléfono debe contener 10 dígitos numéricos.' }),
    (0, class_validator_1.Matches)(/^\d{10}$/, { message: 'El teléfono debe contener 10 dígitos numéricos.' }),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'WHATSAPP',
        enum: ['WHATSAPP', 'CALL', 'EMAIL'],
        description: 'Método de contacto preferido',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsIn)(['WHATSAPP', 'CALL', 'EMAIL']),
    __metadata("design:type", String)
], CreateCustomerDto.prototype, "contactMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [address_dto_1.CreateAddressDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => address_dto_1.CreateAddressDto),
    __metadata("design:type", Array)
], CreateCustomerDto.prototype, "addresses", void 0);
//# sourceMappingURL=create-customer.dto.js.map