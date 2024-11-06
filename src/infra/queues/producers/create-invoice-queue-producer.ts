// src/infra/queues/producers/invoice-queue-producer.ts
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { CreateInvoiceUseCaseRequest } from '@/domain/invoice/use-cases/create-invoice';
import { Language } from '@/i18n/i18n.service';

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
                    delay: 1000, // 1 segundo
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