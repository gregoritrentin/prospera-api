import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Language } from '@/i18n/i18n.service';

interface ProcessInvoiceSubscriptionJobData {
    startDate: Date;
    endDate: Date;
    language: Language | string;
}

@Injectable()
export class ProcessInvoiceSubscriptionQueueProducer {
    private readonly logger = new Logger(ProcessInvoiceSubscriptionQueueProducer.name);

    constructor(
        @InjectQueue('invoice-subscription') private invoiceSubscriptionQueue: Queue
    ) { }

    async addProcessInvoiceSubscriptionJob(data: ProcessInvoiceSubscriptionJobData) {
        try {
            const job = await this.invoiceSubscriptionQueue.add('process-invoice-subscription', data, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
                removeOnComplete: true,
                removeOnFail: false,
            });

            this.logger.log(`Process Invoice Subscription job added to queue: ${job.id}`);

            return {
                jobId: job.id.toString()
            };
        } catch (error) {
            this.logger.error('Failed to add invoice subscription job to queue:', error);
            throw error;
        }
    }
}