// src/infra/queues/queue.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Modules
import { EmailModule } from '../email/email.module';
import { EnvModule } from '../env/env.module';
import { DatabaseModule } from '../database/database.module';
import { FileModule } from '../file/file.module';
import { BoletoModule } from '../boleto/boleto.module';
import { I18nModule } from '@/i18n';
import { NfseModule } from '../nfse/nfse.module';

// Service
import { BullQueueService } from '@/infra/queues/queue.service';

// Producers
import { EmailQueueProducer } from './producers/email-queue-producer';
import { BoletoQueueProducer } from './producers/boleto-queue-producer';
import { CreateInvoiceQueueProducer } from './producers/create-invoice-queue-producer';
import { NfseQueueProducer } from './producers/nfse-queue-producer';

// Consumers
import { EmailQueueConsumer } from './consumers/email-queue-consumer';
import { BoletoQueueConsumer } from './consumers/create-boleto-queue-consumer';
import { CreateInvoiceQueueConsumer } from './consumers/create-invoice-queue-consumer';
import { ProcessSubscriptionInvoiceQueueConsumer } from './consumers/process-subscription-invoice-queue-consumer';
import { NfseQueueConsumer } from './consumers/nfse-queue-consumer';

// Providers & Use Cases
import { QueueProvider } from '@/domain/interfaces/queue-provider';
import { UploadAndCreateFileUseCase } from '@/domain/file/use-cases/upload-and-create-file';
import { CreateBoletoUseCase } from '@/domain/transaction/use-cases/create-boleto';
import { CreateInvoiceUseCase } from '@/domain/invoice/use-cases/create-invoice';

@Module({
    imports: [
        // Módulos de dependência
        EmailModule,
        EnvModule,
        DatabaseModule,
        FileModule,
        I18nModule,
        BoletoModule,
        forwardRef(() => NfseModule),

        // Configuração do Bull
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                redis: configService.get('REDIS_URL'),
                defaultJobOptions: {
                    removeOnComplete: true,
                    removeOnFail: false,
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 1000,
                    },
                },
                settings: {
                    stalledInterval: 30000,
                    maxStalledCount: 3,
                }
            }),
            inject: [ConfigService],
        }),

        // Registro das filas
        BullModule.registerQueue(
            {
                name: 'email',
                defaultJobOptions: {
                    removeOnComplete: true,
                    removeOnFail: false,
                }
            },
            {
                name: 'boleto',
                defaultJobOptions: {
                    removeOnComplete: true,
                    removeOnFail: false,
                }
            },
            {
                name: 'invoice',
                defaultJobOptions: {
                    removeOnComplete: true,
                    removeOnFail: false,
                }
            },
            {
                name: 'subscription-invoice',
                defaultJobOptions: {
                    removeOnComplete: true,
                    removeOnFail: false,
                }
            },
            {
                name: 'nfse',
                defaultJobOptions: {
                    removeOnComplete: true,
                    removeOnFail: false,
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 5000,
                    }
                }
            }
        ),
    ],
    providers: [
        // Service Implementation
        {
            provide: QueueProvider,
            useClass: BullQueueService
        },

        // Producers
        EmailQueueProducer,
        BoletoQueueProducer,
        CreateInvoiceQueueProducer,
        NfseQueueProducer,

        // Consumers
        EmailQueueConsumer,
        BoletoQueueConsumer,
        CreateInvoiceQueueConsumer,
        ProcessSubscriptionInvoiceQueueConsumer,
        NfseQueueConsumer,

        // Use Cases
        UploadAndCreateFileUseCase,
        CreateInvoiceUseCase,
        CreateBoletoUseCase,
    ],
    exports: [
        BullModule,
        QueueProvider,

        // Producers
        EmailQueueProducer,
        BoletoQueueProducer,
        CreateInvoiceQueueProducer,
        NfseQueueProducer,

        // Consumers
        EmailQueueConsumer,
        BoletoQueueConsumer,
        CreateInvoiceQueueConsumer,
        ProcessSubscriptionInvoiceQueueConsumer,
        NfseQueueConsumer,
    ],
})
export class QueueModule { }