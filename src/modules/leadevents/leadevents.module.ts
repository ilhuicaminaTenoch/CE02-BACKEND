import { Module, Global } from '@nestjs/common';
import { LeadEventsService } from './leadevents.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { LeadEventsAutoCloseCron } from './leadevents.autoclose.cron';

@Global()
@Module({
    providers: [LeadEventsService, PrismaService, LeadEventsAutoCloseCron],
    exports: [LeadEventsService],
})
export class LeadEventsModule { }
