import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { SicrediBoletoService } from './sicredi-boleto.service';
import { BoletoProvider } from '@/domain/interfaces/boleto-provider';

@Module({
    imports: [EnvModule],
    providers: [
        {
            provide: BoletoProvider,
            useClass: SicrediBoletoService,
        },
    ],
    exports: [BoletoProvider],

})
export class BoletoModule { }