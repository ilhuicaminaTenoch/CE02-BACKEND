import { PrismaService } from '@/common/prisma/prisma.service';
import { AddItemDto, UpdateItemDto } from './dto/add-item.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { SyscomService } from '../syscom/syscom.service';
export declare class OrdersService {
    private prisma;
    private syscom;
    constructor(prisma: PrismaService, syscom: SyscomService);
    getOrCreateCart(customerId: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            unitPrice: number;
            lineTotal: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        total: number;
    }>;
    addItem(addItemDto: AddItemDto): Promise<any>;
    updateItem(itemId: string, updateItemDto: UpdateItemDto): Promise<any>;
    removeItem(itemId: string): Promise<any>;
    submitOrder(customerId: string): Promise<{
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            unitPrice: number;
            lineTotal: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        total: number;
    }>;
    findAll(query: OrderQueryDto): Promise<{
        items: ({
            customer: {
                name: string;
                id: string;
                email: string;
                lastName: string;
                phone: string;
                contactMethod: import(".prisma/client").$Enums.ContactMethod;
                createdAt: Date;
                updatedAt: Date;
            };
            items: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                productId: string;
                quantity: number;
                unitPrice: number;
                lineTotal: number;
                orderId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            customerId: string;
            status: import(".prisma/client").$Enums.OrderStatus;
            subtotal: number;
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
            name: string;
            id: string;
            email: string;
            lastName: string;
            phone: string;
            contactMethod: import(".prisma/client").$Enums.ContactMethod;
            createdAt: Date;
            updatedAt: Date;
        };
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            unitPrice: number;
            lineTotal: number;
            orderId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        customerId: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        subtotal: number;
        total: number;
    }>;
    private recalculateTotals;
}
