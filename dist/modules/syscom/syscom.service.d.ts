import { ConfigService } from '@nestjs/config';
export declare class SyscomService {
    private configService;
    private readonly logger;
    private accessToken;
    private tokenExpiresAt;
    private exchangeRate;
    private exchangeRateExpiresAt;
    constructor(configService: ConfigService);
    private getAccessToken;
    getExchangeRate(): Promise<number>;
    fetch(endpoint: string, params?: Record<string, any>): Promise<any>;
    getProducts(query: any): Promise<any>;
    getProduct(id: string): Promise<any>;
}
