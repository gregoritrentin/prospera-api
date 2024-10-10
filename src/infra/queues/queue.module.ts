import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from '../email/email.module';
import { EnvModule } from '../env/env.module';
import { DatabaseModule } from '../database/database.module';
import { FileModule } from '../file/file.module';
import { I18nModule } from '@/i18n';

import { EmailQueueConsumer } from '@/infra/queues/consumers/email-queue-consumer';
import { EmailQueueProducer } from '@/infra/queues/producers/email-queue-producer';
import { BoletoQueueProducer } from './producers/boleto-queue-producer';
import { BoletoQueueConsumer } from './consumers/boleto-queue-consumer';
import { BoletoModule } from '../boleto/boleto.module';
import { UploadAndCreateFileUseCase } from '@/domain/file/use-cases/upload-and-create-file';

@Module({
    imports: [
        EmailModule,
        EnvModule,
        DatabaseModule,
        FileModule,
        I18nModule,
        BoletoModule,

        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                redis: configService.get('REDIS_URL'),
                defaultJobOptions: {
                    removeOnComplete: true,
                    removeOnFail: false,
                },
            }),
            inject: [ConfigService],
        }),
        BullModule.registerQueue(
            { name: 'email' },
            { name: 'whatsapp' },
            { name: 'boleto' }
        ),
    ],
    providers: [
        EmailQueueProducer,
        EmailQueueConsumer,
        BoletoQueueProducer,
        BoletoQueueConsumer,
        UploadAndCreateFileUseCase,
    ],
    exports: [
        BullModule,
        EmailQueueProducer,
        EmailQueueConsumer,
        BoletoQueueProducer,
        BoletoQueueConsumer,
    ],
})
export class QueueModule { }