import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LeadEventsService } from './leadevents.service';
import { LeadEventType } from '@prisma/client';
import { randomUUID } from 'crypto';

@Injectable()
export class LeadEventsAutoCloseCron {
    private readonly logger = new Logger(LeadEventsAutoCloseCron.name);
    private readonly ADVISORY_LOCK_ID = 902002;

    constructor(
        private prisma: PrismaService,
        private leadEventsService: LeadEventsService,
        private configService: ConfigService,
    ) { }

    @Cron(process.env.AUTO_CLOSE_CRON || '0 0 2 * * *')
    async handleAutoClose() {
        const isEnabled = this.configService.get<boolean>('AUTO_CLOSE_ENABLED', true);
        if (!isEnabled) {
            this.logger.log('Auto-close CRON is disabled via AUTO_CLOSE_ENABLED');
            return;
        }

        // Advisory Lock to avoid parallel execution
        const lockAcquired = await this.acquireLock();
        if (!lockAcquired) {
            this.logger.warn('Could not acquire advisory lock, skipping CRON execution');
            return;
        }

        try {
            this.logger.log('Starting Lead Auto-Close Job');

            await this.processRule(
                'SUBMITTED_STALE',
                'ORDER_SUBMITTED',
                this.configService.get<number>('AUTO_LOST_SUBMITTED_DAYS', 14),
                'order_submitted_at',
                'NO_RESPONSE'
            );

            await this.processRule(
                'APPOINTMENT_STALE',
                'APPOINTMENT_SCHEDULED',
                this.configService.get<number>('AUTO_LOST_APPOINTMENT_DAYS', 7),
                'appointment_scheduled_at',
                'NO_FOLLOWUP'
            );

            await this.processRule(
                'LEAD_STALE',
                'LEAD_CREATED',
                this.configService.get<number>('AUTO_LOST_LEAD_DAYS', 30),
                'lead_created_at',
                'COLD_LEAD'
            );

            this.logger.log('Lead Auto-Close Job completed');
        } catch (error) {
            this.logger.error('Error during auto-close CRON execution', error.stack);
        } finally {
            await this.releaseLock();
        }
    }

    private async processRule(
        rule: string,
        lastStage: string,
        days: number,
        column: string,
        reason: string
    ) {
        const batchSize = this.configService.get<number>('AUTO_CLOSE_BATCH_SIZE', 200);
        let processedCount = 0;
        let insertedCount = 0;
        let skippedTerminalCount = 0;

        while (true) {
            const candidates = await this.getCandidates(column, days, batchSize);
            if (candidates.length === 0) break;

            for (const candidate of candidates) {
                processedCount++;

                // Idempotency re-validation
                const isTerminal = await this.checkIfTerminal(candidate.leadId);
                if (isTerminal) {
                    skippedTerminalCount++;
                    continue;
                }

                try {
                    await this.leadEventsService.createEvent({
                        customerId: candidate.customerId,
                        leadId: candidate.leadId,
                        type: LeadEventType.DEAL_LOST,
                        metadata: {
                            auto: true,
                            rule,
                            reason,
                            thresholdDays: days,
                            lastStage,
                        },
                    });
                    insertedCount++;
                } catch (err) {
                    this.logger.error(`Failed to close lead ${candidate.leadId}: ${err.message}`);
                }
            }

            // If we got fewer candidates than batchSize, we are likely done for this rule
            if (candidates.length < batchSize) break;
        }

        this.logger.log(
            `Rule ${rule}: candidates=${processedCount} / inserted=${insertedCount} / skipped_terminal=${skippedTerminalCount}`
        );
    }

    private async getCandidates(column: string, days: number, limit: number): Promise<any[]> {
        // We use v_lead_funnel view in ce02 schema
        // Logic depends on the specific rule's column
        const query = `
      SELECT "leadId", "customerId"
      FROM ce02.v_lead_funnel
      WHERE ${column} IS NOT NULL
        AND deal_won_at IS NULL 
        AND deal_lost_at IS NULL
        AND spam_flagged_at IS NULL
        ${this.getExtraWheres(column)}
        AND ${column} < now() - ($1::int * interval '1 day')
      LIMIT ($2::bigint);
    `;

        return this.prisma.$queryRawUnsafe(query, Number(days), Number(limit));
    }

    private getExtraWheres(column: string): string {
        if (column === 'order_submitted_at') return '';
        if (column === 'appointment_scheduled_at') return 'AND order_submitted_at IS NULL';
        if (column === 'lead_created_at') return 'AND appointment_scheduled_at IS NULL AND order_submitted_at IS NULL';
        return '';
    }

    private async checkIfTerminal(leadId: string): Promise<boolean> {
        const terminalEvent = await this.prisma.leadEvent.findFirst({
            where: {
                leadId,
                type: {
                    in: [LeadEventType.DEAL_WON, LeadEventType.DEAL_LOST, LeadEventType.SPAM_FLAGGED]
                }
            }
        });
        return !!terminalEvent;
    }

    private async acquireLock(): Promise<boolean> {
        const result: any[] = await this.prisma.$queryRawUnsafe(
            `SELECT pg_try_advisory_lock($1)`,
            this.ADVISORY_LOCK_ID
        );
        return result[0]?.pg_try_advisory_lock === true;
    }

    private async releaseLock(): Promise<void> {
        await this.prisma.$queryRawUnsafe(
            `SELECT pg_advisory_unlock($1)`,
            this.ADVISORY_LOCK_ID
        );
    }
}
