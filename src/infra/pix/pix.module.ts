import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { SicrediPixService } from './sicredi-pix.service';
import { PixProvider } from '@/domain/providers/pix-provider';

@Module({
    imports: [EnvModule],
    providers: [
        {
            provide: PixProvider,
            useClass: SicrediPixService,
        },
    ],
    exports: [PixProvider],

})
export class PixModule { }