import { Module, Global } from '@nestjs/common';
import { SyscomService } from './syscom.service';

@Global()
@Module({
    providers: [SyscomService],
    exports: [SyscomService],
})
export class SyscomModule { }
