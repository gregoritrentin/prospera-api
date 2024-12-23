import { Module, forwardRef } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { DatabaseModule } from '../database/database.module';
import { I18nModule } from '@/i18n';
import { QueueModule } from '../queues/queue.module';
import { SicrediBoletoService } from './sicredi-boleto.service';
import { BoletoProvider } from '@/domain/interfaces/boleto-provider';
import { CreateBoletoUseCase } from '@/domain/transaction/use-cases/create-boleto';

@Module({
    imports: [
        EnvModule,
        DatabaseModule,
        I18nModule,
        forwardRef(() => QueueModule), // Usando forwardRef para quebrar a dependência circular
    ],
    providers: [
        {
            provide: BoletoProvider,
            useClass: SicrediBoletoService,
        },
        CreateBoletoUseCase,
    ],
    exports: [
        BoletoProvider,
        CreateBoletoUseCase,
    ],
})
export class BoletoModule { }