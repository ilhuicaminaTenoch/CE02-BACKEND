import { Module, Global } from '@nestjs/common';
import { LeadEventsService } from './leadevents.service';
import { PrismaService } from '../../common/prisma/prisma.service';

@Global()
@Module({
    providers: [LeadEventsService, PrismaService],
    exports: [LeadEventsService],
})
export class LeadEventsModule { }
