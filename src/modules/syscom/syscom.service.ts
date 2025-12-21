import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SyscomService {
    private readonly logger = new Logger(SyscomService.name);
    private accessToken: string | null = null;
    private tokenExpiresAt: number | null = null;
    private exchangeRate: number | null = null;
    private exchangeRateExpiresAt: number | null = null;

    constructor(private configService: ConfigService) { }

    private async getAccessToken(): Promise<string> {
        const now = Date.now();
        if (this.accessToken && this.tokenExpiresAt && now < this.tokenExpiresAt) {
            return this.accessToken;
        }

        const clientId = this.configService.get<string>('SYSCOM_CLIENT_ID');
        const clientSecret = this.configService.get<string>('SYSCOM_CLIENT_SECRET');
        const baseUrl = this.configService.get<string>('SYSCOM_API_BASE_URL');

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
                throw new UnauthorizedException('Failed to authenticate with Syscom');
            }

            const data = await response.json();
            this.accessToken = data.access_token;
            // Expires in is usually in seconds
            this.tokenExpiresAt = now + (data.expires_in - 60) * 1000; // Subtract 1 minute for safety
            return this.accessToken;
        } catch (error) {
            this.logger.error('Error getting Syscom access token', error);
            throw new UnauthorizedException('Syscom authentication error');
        }
    }

    async getExchangeRate(): Promise<number> {
        const now = Date.now();
        if (this.exchangeRate && this.exchangeRateExpiresAt && now < this.exchangeRateExpiresAt) {
            return this.exchangeRate;
        }

        const data = await this.fetch('tipocambio');
        if (data && data.normal) {
            this.exchangeRate = parseFloat(data.normal);
            this.exchangeRateExpiresAt = now + 6 * 60 * 60 * 1000; // Cache for 6 hours
            return this.exchangeRate;
        }

        this.logger.warn('Could not fetch exchange rate from Syscom, using fallback 18.0');
        return 18.0; // Fallback
    }

    async fetch(endpoint: string, params: Record<string, any> = {}): Promise<any> {
        const token = await this.getAccessToken();
        const baseUrl = this.configService.get<string>('SYSCOM_API_BASE_URL');

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
        } catch (error) {
            this.logger.error(`Failed to fetch from Syscom: ${endpoint}`, error);
            return null;
        }
    }

    async getProducts(query: any) {
        const params = {
            pagina: query.page || 1,
            busqueda: query.search,
            categoria: query.category,
            // Add other params if needed
        };
        return this.fetch('productos', params);
    }

    async getProduct(id: string) {
        return this.fetch(`productos/${id}`);
    }
}
