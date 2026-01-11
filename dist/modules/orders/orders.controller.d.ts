import { OrdersService } from './orders.service';
import { AddItemDto, UpdateItemDto } from './dto/add-item.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateLaborCostDto } from './dto/update-labor-cost.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<any>;
    submitById(id: string, leadId: string, ip: string, userAgent: string): Promise<any>;
    getCart(customerId: string): Promise<{
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
    submit(customerId: string, ip: string, userAgent: string): Promise<any>;
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
    updateLaborCost(id: string, dto: UpdateLaborCostDto): Promise<any>;
    quoteOrder(id: string, dto: Partial<UpdateLaborCostDto>): Promise<any>;
}
