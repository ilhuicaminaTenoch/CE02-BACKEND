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
var SyscomService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyscomService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let SyscomService = SyscomService_1 = class SyscomService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(SyscomService_1.name);
        this.accessToken = null;
        this.tokenExpiresAt = null;
        this.exchangeRate = null;
        this.exchangeRateExpiresAt = null;
    }
    async getAccessToken() {
        const now = Date.now();
        if (this.accessToken && this.tokenExpiresAt && now < this.tokenExpiresAt) {
            return this.accessToken;
        }
        const clientId = this.configService.get('SYSCOM_CLIENT_ID');
        const clientSecret = this.configService.get('SYSCOM_CLIENT_SECRET');
        const baseUrl = this.configService.get('SYSCOM_API_BASE_URL');
        try {
            const response = await fetch(`${baseUrl}/oauth/token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: clientId,
                    client_secret: clientSecret,
                    grant_type: 'client_credentials',
                }),
            });
            if (!response.ok) {
                throw new common_1.UnauthorizedException('Failed to authenticate with Syscom');
            }
            const data = await response.json();
            this.accessToken = data.access_token;
            this.tokenExpiresAt = now + (data.expires_in - 60) * 1000;
            return this.accessToken;
        }
        catch (error) {
            this.logger.error('Error getting Syscom access token', error);
            throw new common_1.UnauthorizedException('Syscom authentication error');
        }
    }
    async getExchangeRate() {
        const now = Date.now();
        if (this.exchangeRate && this.exchangeRateExpiresAt && now < this.exchangeRateExpiresAt) {
            return this.exchangeRate;
        }
        const data = await this.fetch('tipocambio');
        if (data && data.normal) {
            this.exchangeRate = parseFloat(data.normal);
            this.exchangeRateExpiresAt = now + 6 * 60 * 60 * 1000;
            return this.exchangeRate;
        }
        this.logger.warn('Could not fetch exchange rate from Syscom, using fallback 18.0');
        return 18.0;
    }
    async fetch(endpoint, params = {}) {
        const token = await this.getAccessToken();
        const baseUrl = this.configService.get('SYSCOM_API_BASE_URL');
        const url = new URL(`${baseUrl}/api/v1/${endpoint}`);
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });
        try {
            const response = await fetch(url.toString(), {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                this.logger.error(`Syscom API error: ${response.status}`, errorData);
                return null;
            }
            return await response.json();
        }
        catch (error) {
            this.logger.error(`Failed to fetch from Syscom: ${endpoint}`, error);
            return null;
        }
    }
    async getProducts(query) {
        const params = {
            pagina: query.page || 1,
            busqueda: query.search,
            categoria: query.category,
        };
        return this.fetch('productos', params);
    }
    async getProduct(id) {
        return this.fetch(`productos/${id}`);
    }
};
exports.SyscomService = SyscomService;
exports.SyscomService = SyscomService = SyscomService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SyscomService);
//# sourceMappingURL=syscom.service.js.map