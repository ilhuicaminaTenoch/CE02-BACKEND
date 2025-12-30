import { CreateAddressDto } from './address.dto';
export type ContactMethod = 'WHATSAPP' | 'CALL' | 'EMAIL';
export declare class CreateCustomerDto {
    email: string;
    name: string;
    lastName: string;
    phone: string;
    contactMethod: ContactMethod;
    addresses?: CreateAddressDto[];
    utm_source?: string;
    utm_campaign?: string;
    utm_medium?: string;
    utm_content?: string;
    utm_term?: string;
    referrer?: string;
    landingPath?: string;
}
