import { PrismaService } from '@/common/prisma/prisma.service';
import { AddItemDto, UpdateItemDto } from './dto/add-item.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { SyscomService } from '../syscom/syscom.service';
import { MailService } from '../mail/mail.service';
export declare class OrdersService {
    private prisma;
    private syscom;
    private mailService;
    constructor(prisma: PrismaService, syscom: SyscomService, mailService: MailService);
    getOrCreateCart(customerId: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            unitPrice: number;
            lineTotal: number;
            productId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        subtotal: number;
        customerId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
    }>;
    addItem(addItemDto: AddItemDto): Promise<any>;
    updateItem(itemId: string, updateItemDto: UpdateItemDto): Promise<any>;
    removeItem(itemId: string): Promise<any>;
    submitOrder(customerId: string): Promise<{
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            lastName: string;
            phone: string;
            contactMethod: import(".prisma/client").$Enums.ContactMethod;
        };
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            unitPrice: number;
            lineTotal: number;
            productId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        subtotal: number;
        customerId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
    }>;
    private enrichAndSendEmail;
    findAll(query: OrderQueryDto): Promise<{
        items: ({
            customer: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                email: string;
                lastName: string;
                phone: string;
                contactMethod: import(".prisma/client").$Enums.ContactMethod;
            };
            items: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                unitPrice: number;
                lineTotal: number;
                productId: string;
                orderId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            subtotal: number;
            customerId: string;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            total: number;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<{
        customer: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            lastName: string;
            phone: string;
            contactMethod: import(".prisma/client").$Enums.ContactMethod;
        };
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            quantity: number;
            unitPrice: number;
            lineTotal: number;
            productId: string;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        subtotal: number;
        customerId: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.OrderStatus;
        total: number;
    }>;
    private recalculateTotals;
}
