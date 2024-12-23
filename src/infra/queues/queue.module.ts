import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Modules - Organizados em ordem alfabética para melhor manutenção
import { BoletoModule } from '../boleto/boleto.module';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { EnvModule } from '../env/env.module';
import { FileModule } from '../file/file.module';
import { I18nModule } from '@/i18n';
import { NfseModule } from '../nfse/nfse.module';

// Service
import { BullQueueService } from '@/infra/queues/queue.service';
import { QueueProvider } from '@/domain/interfaces/queue-provider';

// Producers
import { BoletoQueueProducer } from './producers/boleto-queue-producer';
import { CreateInvoiceQueueProducer } from './producers/create-invoice-queue-producer';
import { EmailQueueProducer } from './producers/email-queue-producer';
import { NfseQueueProducer } from './producers/nfse-queue-producer';

// Consumers
import { BoletoQueueConsumer } from './consumers/create-boleto-queue-consumer';
import { CreateInvoiceQueueConsumer } from './consumers/create-invoice-queue-consumer';
import { EmailQueueConsumer } from './consumers/email-queue-consumer';
import { NfseQueueConsumer } from './consumers/nfse-queue-consumer';
import { ProcessSubscriptionInvoiceQueueConsumer } from './consumers/process-subscription-invoice-queue-consumer';

// Use Cases
import { CreateInvoiceUseCase } from '@/domain/invoice/use-cases/create-invoice';
import { UploadAndCreateFileUseCase } from '@/domain/file/use-cases/upload-and-create-file';

const QUEUE_CONFIG = {
    email: {
        name: 'email',
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: false,
        }
    },
    boleto: {
        name: 'boleto',
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: false,
        }
    },
    invoice: {
        name: 'invoice',
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: false,
        }
    },
    'subscription-invoice': {
        name: 'subscription-invoice',
        defaultJobOptions: {
            removeOnComplete: true,
            removeOnFail: false,
        }
    },
    nfse: {
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
};

@Module({
    imports: [
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
        BullModule.registerQueue(...Object.values(QUEUE_CONFIG)),
        DatabaseModule,
        EmailModule,
        EnvModule,
        FileModule,
        I18nModule,
        forwardRef(() => BoletoModule),
        forwardRef(() => NfseModule),
    ],
    providers: [
        // Service Implementation
        {
            provide: QueueProvider,
            useClass: BullQueueService
        },

        // Producers
        BoletoQueueProducer,
        CreateInvoiceQueueProducer,
        EmailQueueProducer,
        NfseQueueProducer,

        // Consumers
        BoletoQueueConsumer,
        CreateInvoiceQueueConsumer,
        EmailQueueConsumer,
        NfseQueueConsumer,
        ProcessSubscriptionInvoiceQueueConsumer,

        // Use Cases
        CreateInvoiceUseCase,
        UploadAndCreateFileUseCase,
    ],
    exports: [
        BullModule,
        QueueProvider,

        // Producers
        BoletoQueueProducer,
        CreateInvoiceQueueProducer,
        EmailQueueProducer,
        NfseQueueProducer,

        // Consumers
        BoletoQueueConsumer,
        CreateInvoiceQueueConsumer,
        EmailQueueConsumer,
        NfseQueueConsumer,
        ProcessSubscriptionInvoiceQueueConsumer,
    ],
})
export class QueueModule { }