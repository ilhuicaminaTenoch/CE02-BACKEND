import { PrismaService } from '@/common/prisma/prisma.service';
import { AddItemDto, UpdateItemDto } from './dto/add-item.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { SyscomService } from '../syscom/syscom.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { LeadEventsService } from '../leadevents/leadevents.service';
import { MailService } from '../mail/mail.service';
export declare class OrdersService {
    private prisma;
    private syscom;
    private mailService;
    private leadEventsService;
    constructor(prisma: PrismaService, syscom: SyscomService, mailService: MailService, leadEventsService: LeadEventsService);
    create(dto: CreateOrderDto): Promise<any>;
    submitOrderById(id: string, leadId?: string, ip?: string, userAgent?: string): Promise<any>;
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
        customerId: string;
        leadId: string | null;
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        total: number;
        laborCost: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addItem(addItemDto: AddItemDto): Promise<any>;
    updateItem(itemId: string, updateItemDto: UpdateItemDto): Promise<any>;
    removeItem(itemId: string): Promise<any>;
    submitOrder(customerId: string, ip?: string, userAgent?: string): Promise<any>;
    updateLaborCost(id: string, laborCost: number): Promise<any>;
    quoteOrder(id: string, laborCost?: number): Promise<any>;
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
            customerId: string;
            leadId: string | null;
            id: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            subtotal: number;
            total: number;
            laborCost: number | null;
            createdAt: Date;
            updatedAt: Date;
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
        customerId: string;
        leadId: string | null;
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        total: number;
        laborCost: number | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private recalculateTotals;
}
