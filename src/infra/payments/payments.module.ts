import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { SicrediMultipagService } from '@/infra/payments/sicredi-multipag.service';
import { PaymentsProvider } from '@/domain/providers/payments-provider';

@Module({
    imports: [EnvModule],
    providers: [
        {
            provide: PaymentsProvider,
            useClass: SicrediMultipagService,
        },
    ],
    exports: [PaymentsProvider],

})
export class PaymentsModule { }