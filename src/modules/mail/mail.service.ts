import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { AppointmentEmailPayload, OrderQuoteEmailPayload } from './interfaces/mail-payload.interface';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) { }

    async sendAppointmentConfirmationToCustomer(data: AppointmentEmailPayload) {
        if (!data.customerEmail) {
            this.logger.warn(`Missing email for customer: ${data.customerName}`);
            return;
        }

        try {
            await this.mailerService.sendMail({
                to: data.customerEmail,
                subject: 'Confirmación de tu Cita - Seguridad Integral',
                template: './appointment-confirmation',
                context: data,
            });
            this.logger.log(`Confirmation email sent to customer: ${data.customerEmail}`);
        } catch (error) {
            this.logger.error(`Failed to send confirmation email to ${data.customerEmail}`, error.stack);
            // Fail-safe: we don't throw error to avoid breaking the main flow
        }
    }

    async sendNewAppointmentNotificationToTechnician(data: AppointmentEmailPayload) {
        const techEmail = this.configService.get<string>('TECH_EMAIL');
        if (!techEmail) {
            this.logger.warn('TECH_EMAIL is not configured in environment variables');
            return;
        }

        try {
            await this.mailerService.sendMail({
                to: techEmail,
                subject: 'NUEVA CITA ASIGNADA - Seguridad Integral',
                template: './technician-new-appointment',
                context: data,
            });
            this.logger.log(`Notification email sent to technician: ${techEmail}`);
        } catch (error) {
            this.logger.error(`Failed to send technician notification to ${techEmail}`, error.stack);
            // Fail-safe
        }
    }

    async sendOrderQuoteEmail(orderId: string, orderData: any) {
        const { id, createdAt, customer, items, subtotal } = orderData;

        if (!customer?.email) {
            this.logger.warn(`Missing email for customer of order: ${orderId}`);
            return;
        }

        try {
            const dateObj = new Date(createdAt);
            const validUntilObj = new Date(dateObj);
            validUntilObj.setDate(validUntilObj.getDate() + 15);

            const formatDate = (date: Date) => {
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            };

            const formatCurrency = (amount: number) => {
                return new Intl.NumberFormat('es-MX', {
                    style: 'currency',
                    currency: 'MXN',
                }).format(amount);
            };

            const total = subtotal;
            const subtotalExcludingTax = total / 1.16;
            const tax = total - subtotalExcludingTax;

            const payload: OrderQuoteEmailPayload = {
                logo: 'http://localhost:8080/public/favicon.png',
                orderId: id.split('-')[0].toUpperCase(),
                date: formatDate(dateObj),
                validUntil: formatDate(validUntilObj),
                customerFullname: `${customer.name} ${customer.lastName}`,
                customerName: customer.name,
                customerEmail: customer.email,
                customerPhone: customer.phone,
                items: items.map((item: any) => ({
                    name: item.productTitle || `Producto: ${item.productId}`,
                    quantity: item.quantity,
                    unitPriceFormatted: formatCurrency(item.unitPrice),
                    lineTotalFormatted: formatCurrency(item.lineTotal),
                })),
                subtotalFormatted: formatCurrency(subtotalExcludingTax),
                taxFormatted: formatCurrency(tax),
                totalFormatted: formatCurrency(total),
            };

            await this.mailerService.sendMail({
                to: customer.email,
                subject: `Cotización #${payload.orderId} - Seguridad Integral`,
                template: './quote',
                context: payload,
            });

            this.logger.log(`Order quote email sent to customer: ${customer.email} for order: ${orderId}`);
        } catch (error) {
            this.logger.error(`Failed to send order quote email for order ${orderId}`, error.stack);
        }
    }
}
