// src/infra/queues/queue.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Modules
import { EmailModule } from '../email/email.module';
import { EnvModule } from '../env/env.module';
import { DatabaseModule } from '../database/database.module';
import { FileModule } from '../file/file.module';
import { BoletoModule } from '../boleto/boleto.module';
import { I18nModule } from '@/i18n';

// Service
import { BullQueueService } from '@/infra/queues/queue.service';

// Producers
import { EmailQueueProducer } from './producers/email-queue-producer';
import { BoletoQueueProducer } from './producers/boleto-queue-producer';
import { CreateInvoiceQueueProducer } from './producers/create-invoice-queue-producer';

// Consumers
import { EmailQueueConsumer } from './consumers/email-queue-consumer';
import { BoletoQueueConsumer } from './consumers/create-boleto-queue-consumer';
import { CreateInvoiceQueueConsumer } from './consumers/create-invoice-queue-consumer';

// Use Cases
import { UploadAndCreateFileUseCase } from '@/domain/file/use-cases/upload-and-create-file';
import { QueueProvider } from '@/domain/interfaces/queue-provider';
import { CreateBoletoUseCase } from '@/domain/transaction/use-cases/create-boleto';
import { ProcessSubscriptionInvoiceQueueConsumer } from './consumers/process-subscription-invoice-queue-consumer';
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

        // Configuração do Bull
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                redis: configService.get('REDIS_URL'),
                defaultJobOptions: {
                    removeOnComplete: true, // Remove jobs completados
                    removeOnFail: false,    // Mantém jobs que falharam para análise
                    attempts: 3,            // Número de tentativas em caso de falha
                    backoff: {
                        type: 'exponential',
                        delay: 1000,        // Delay inicial de 1 segundo
                    },
                },
                settings: {
                    stalledInterval: 30000, // Verifica jobs travados a cada 30 segundos
                    maxStalledCount: 3,     // Número máximo de vezes que um job pode travar
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

        // Consumers
        EmailQueueConsumer,
        BoletoQueueConsumer,
        CreateInvoiceQueueConsumer,
        ProcessSubscriptionInvoiceQueueConsumer,
        CreateInvoiceUseCase,

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

        // Consumers
        EmailQueueConsumer,
        BoletoQueueConsumer,
        CreateInvoiceQueueConsumer,
        ProcessSubscriptionInvoiceQueueConsumer,
    ],
})
export class QueueModule { }