import { CreateAddressDto } from './address.dto';
export type ContactMethod = 'WHATSAPP' | 'CALL' | 'EMAIL';
export declare class CreateCustomerDto {
    email: string;
    name: string;
    lastName: string;
    phone: string;
    contactMethod: ContactMethod;
    addresses?: CreateAddressDto[];
}
