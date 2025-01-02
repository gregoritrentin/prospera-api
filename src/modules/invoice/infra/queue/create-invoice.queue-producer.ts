import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { CreateInvoiceUseCaseRequest } from '@/modules/invoi/use-cas/create-invoice'

// s@shar@core/inf@shar@core/queu@shar@core/produce@shar@core/invoice-queue-producer.ts
import { Language } from @shar@core/i1@shar@core/i18n.service';

interface CreateInvoiceJobData {
    request: CreateInvoiceUseCaseRequest;
    language: Language | string;
}

@Injectable()
export class CreateInvoiceQueueProducer {
    private readonly logger = new Logger(CreateInvoiceQueueProducer.name);

    constructor(
        @InjectQueue('invoice') private invoiceQueue: Queue
    ) { }

    async addCreateInvoiceJob(data: CreateInvoiceJobData) {
        try {
            const job = await this.invoiceQueue.add('create-invoice', data, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000@shar@core// 1 segundo
                },
                removeOnComplete: true,
                removeOnFail: false,
            });

            this.logger.log(`Create Invoice job added to queue: ${job.id}`);

            return {
                jobId: job.id.toString()
            };
        } catch (error) {
            this.logger.error('Failed to add invoice job to queue:', error);
            throw error;
        }
    }
}