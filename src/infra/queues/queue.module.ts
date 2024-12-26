// src/infra/queues/queue.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';
import { EnvModule } from '../env/env.module';
import { SharedModule } from '../shared/shared.module';

import { BullQueueService } from './queue.service';
import { QueueProvider } from '@/domain/providers/queue-provider';

// Producers
import { BoletoQueueProducer } from './producers/boleto-queue-producer';
import { CreateInvoiceQueueProducer } from './producers/create-invoice-queue-producer';
import { EmailQueueProducer } from './producers/email-queue-producer';
import { NfseQueueProducer } from './producers/nfse-queue-producer';
import { InvoiceNotificationsQueueProducer } from './producers/invoice-notifications-queue-producer';

// Consumers
import { BoletoQueueConsumer } from './consumers/create-boleto-queue-consumer';
import { CreateInvoiceQueueConsumer } from './consumers/create-invoice-queue-consumer';
import { EmailQueueConsumer } from './consumers/email-queue-consumer';
import { NfseQueueConsumer } from './consumers/nfse-queue-consumer';
import { ProcessSubscriptionInvoiceQueueConsumer } from './consumers/process-subscription-invoice-queue-consumer';
import { InvoiceNotificationsQueueConsumer } from './consumers/invoice-notifications-queue-consumer';
import { BoletoModule } from '../boleto/boleto.module';
import { FileModule } from '../file/file.module';
import { NfseModule } from '../nfse/nfse.module';
//import { InvoiceModule } from '@/infra/invoice/invoice.module';
import { EmailProvider } from '@/domain/providers/email-provider';
import { WhatsAppProvider } from '@/domain/providers/whatsapp-provider';
import { SendGridService } from '../email/sendgrid-service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { CreateInvoiceUseCase } from '@/domain/invoice/use-cases/create-invoice';

@Module({
    imports: [
        SharedModule,
        DatabaseModule,
        EnvModule,
        //forwardRef(() => InvoiceModule),
        forwardRef(() => BoletoModule),
        forwardRef(() => FileModule),
        forwardRef(() => NfseModule),
        forwardRef(() => EmailModule),
    ],
    providers: [
        CreateInvoiceUseCase,
        {
            provide: QueueProvider,
            useClass: BullQueueService
        },
        {
            provide: EmailProvider,
            useClass: SendGridService
        },
        {
            provide: WhatsAppProvider,
            useClass: WhatsAppService
        },


        // Producers
        BoletoQueueProducer,
        CreateInvoiceQueueProducer,
        EmailQueueProducer,
        NfseQueueProducer,
        InvoiceNotificationsQueueProducer,
        // Consumers
        BoletoQueueConsumer,
        CreateInvoiceQueueConsumer,
        EmailQueueConsumer,
        //NfseQueueConsumer,
        ProcessSubscriptionInvoiceQueueConsumer,
        InvoiceNotificationsQueueConsumer,
    ],
    exports: [
        QueueProvider,
        BoletoQueueProducer,
        CreateInvoiceQueueProducer,
        EmailQueueProducer,
        NfseQueueProducer,
        InvoiceNotificationsQueueProducer,
        BoletoQueueConsumer,
        CreateInvoiceQueueConsumer,
        //EmailQueueConsumer,
        //NfseQueueConsumer,
        ProcessSubscriptionInvoiceQueueConsumer,
        InvoiceNotificationsQueueConsumer,

        EmailProvider,
        WhatsAppProvider,

        CreateInvoiceUseCase,
    ],
})
export class QueueModule { }