import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { AppointmentEmailPayload } from './interfaces/mail-payload.interface';

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
}
