// src/infra/boleto/boleto.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { DatabaseModule } from '../database/database.module';
import { I18nModule } from '@/i18n';
import { SharedModule } from '../shared/shared.module';
import { QueueModule } from '../queues/queue.module';
import { SicrediBoletoService } from './sicredi-boleto.service';
import { BoletoProvider } from '@/domain/providers/boleto-provider';
import { CreateBoletoUseCase } from '@/domain/transaction/use-cases/create-boleto';
import { RecordTransactionMetricUseCase } from '@/domain/metric/use-case/record-transaction-metrics';

@Module({
    imports: [
        EnvModule,
        DatabaseModule,
        I18nModule,
        SharedModule,
        forwardRef(() => QueueModule),  // Adicione forwardRef aqui,
    ],
    providers: [
        {
            provide: BoletoProvider,
            useClass: SicrediBoletoService,
        },
        CreateBoletoUseCase,
        RecordTransactionMetricUseCase,
    ],
    exports: [
        BoletoProvider,
        CreateBoletoUseCase,
        RecordTransactionMetricUseCase,
    ],
})
export class BoletoModule { }