import { Test, TestingModule } from '@nestjs/testing';
import { LeadEventsAutoCloseCron } from './leadevents.autoclose.cron';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LeadEventsService } from './leadevents.service';
import { ConfigService } from '@nestjs/config';
import { LeadEventType } from '@prisma/client';

describe('LeadEventsAutoCloseCron', () => {
    let cron: LeadEventsAutoCloseCron;
    let prisma: PrismaService;
    let leadEventsService: LeadEventsService;

    const mockPrisma = {
        $queryRawUnsafe: jest.fn(),
        leadEvent: {
            findFirst: jest.fn(),
        },
    };

    const mockLeadEventsService = {
        createEvent: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn((key: string, defaultValue: any) => {
            if (key === 'AUTO_CLOSE_ENABLED') return true;
            if (key === 'AUTO_CLOSE_BATCH_SIZE') return 200;
            if (key === 'AUTO_LOST_SUBMITTED_DAYS') return 14;
            if (key === 'AUTO_LOST_APPOINTMENT_DAYS') return 7;
            if (key === 'AUTO_LOST_LEAD_DAYS') return 30;
            return defaultValue;
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LeadEventsAutoCloseCron,
                { provide: PrismaService, useValue: mockPrisma },
                { provide: LeadEventsService, useValue: mockLeadEventsService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        cron = module.get<LeadEventsAutoCloseCron>(LeadEventsAutoCloseCron);
        prisma = module.get<PrismaService>(PrismaService);
        leadEventsService = module.get<LeadEventsService>(LeadEventsService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(cron).toBeDefined();
    });

    describe('handleAutoClose', () => {
        it('should skip if advisory lock is not acquired', async () => {
            mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ pg_try_advisory_lock: false }]);
            const loggerSpy = jest.spyOn((cron as any).logger, 'warn');

            await cron.handleAutoClose();

            expect(loggerSpy).toHaveBeenCalledWith(expect.stringContaining('Could not acquire advisory lock'));
            expect(mockPrisma.$queryRawUnsafe).toHaveBeenCalledWith(expect.stringContaining('pg_try_advisory_lock'), 902002);
        });

        it('should process rules and create events for candidates', async () => {
            // Mock lock acquisition
            mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ pg_try_advisory_lock: true }]);

            // Mock candidates for SUBMITTED_STALE
            mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([
                { leadId: 'lead1', customerId: 'cust1' },
            ]);
            // Idempotency check: not terminal
            mockPrisma.leadEvent.findFirst.mockResolvedValueOnce(null);

            // Mock candidates for APPOINTMENT_STALE (empty)
            mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([]);

            // Mock candidates for LEAD_STALE (empty)
            mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([]);

            // Mock lock release
            mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([]);

            await cron.handleAutoClose();

            expect(mockLeadEventsService.createEvent).toHaveBeenCalledWith({
                customerId: 'cust1',
                leadId: 'lead1',
                type: LeadEventType.DEAL_LOST,
                metadata: expect.objectContaining({
                    rule: 'SUBMITTED_STALE',
                    reason: 'NO_RESPONSE',
                }),
            });
        });

        it('should skip if candidate is already terminal', async () => {
            mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ pg_try_advisory_lock: true }]);
            mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([{ leadId: 'lead1', customerId: 'cust1' }]);

            // Idempotency check: already LOST
            mockPrisma.leadEvent.findFirst.mockResolvedValueOnce({ id: 'event1', type: LeadEventType.DEAL_LOST });

            mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([]); // APPOINTMENT_STALE
            mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([]); // LEAD_STALE
            mockPrisma.$queryRawUnsafe.mockResolvedValueOnce([]); // lock release

            await cron.handleAutoClose();

            expect(mockLeadEventsService.createEvent).not.toHaveBeenCalled();
        });
    });
});
