import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

interface PrintBoletoJobData {
    businessId: string;
    boletoId: string;
    language?: string;
}

@Injectable()
export class BoletoQueueProducer {
    private readonly logger = new Logger(BoletoQueueProducer.name);

    constructor(@InjectQueue('boleto') private boletoQueue: Queue) {
        this.setupEventListeners();
    }

    async addPrintBoletoJob(data: PrintBoletoJobData) {
        const job = await this.boletoQueue.add('print-boleto', data);
        this.logger.log(`Print Boleto job added to queue: ${job.id}`);
        return job;
    }

    private setupEventListeners() {
        this.boletoQueue.on('global:completed', (jobId) => {
            this.logger.log(`Job ${jobId} completed`);
        });

        this.boletoQueue.on('global:failed', (jobId, err) => {
            this.logger.error(`Job ${jobId} failed with error: ${err.message}`);
        });

        this.boletoQueue.on('global:stalled', (jobId) => {
            this.logger.warn(`Job ${jobId} is stalled`);
        });

        this.boletoQueue.on('global:progress', (jobId, progress) => {
            this.logger.log(`Job ${jobId} is ${progress}% complete`);
        });
    }
}