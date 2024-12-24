// src/infra/queues/producers/invoice-notifications-queue.producer.ts

import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

interface ProcessInvoiceNotificationsJobData {
    date: Date;
    language?: string;
}

interface InvoiceNotificationsJobResponse {
    jobId: string;
}

@Injectable()
export class InvoiceNotificationsQueueProducer {
    private readonly logger = new Logger(InvoiceNotificationsQueueProducer.name);

    constructor(
        @InjectQueue('invoice-notifications') private notificationsQueue: Queue
    ) {
        this.setupEventListeners();
    }

    async addProcessInvoiceNotificationsJob(
        data: ProcessInvoiceNotificationsJobData
    ): Promise<InvoiceNotificationsJobResponse> {
        try {
            const job = await this.notificationsQueue.add('process', data, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000
                },
                removeOnComplete: true,
                removeOnFail: false
            });

            this.logger.log(`Invoice notifications job added to queue: ${job.id}`, {
                date: data.date,
                jobId: job.id
            });

            return {
                jobId: job.id.toString()
            };
        } catch (error) {
            this.logger.error('Error adding invoice notifications job to queue', {
                error: error instanceof Error ? error.message : 'Unknown error',
                data
            });
            throw error;
        }
    }

    private setupEventListeners() {
        this.notificationsQueue.on('completed', (job) => {
            this.logger.log(`Job completed successfully: ${job.id}`, {
                jobName: job.name,
                data: job.data
            });
        });

        this.notificationsQueue.on('failed', (job, error) => {
            this.logger.error(`Job failed: ${job.id}`, {
                jobName: job.name,
                data: job.data,
                error: error.message,
                attempts: job.attemptsMade
            });
        });

        this.notificationsQueue.on('stalled', (job) => {
            this.logger.warn(`Job stalled: ${job.id}`, {
                jobName: job.name,
                data: job.data
            });
        });
    }

    async getQueueMetrics() {
        const [waiting, active, completed, failed, delayed] = await Promise.all([
            this.notificationsQueue.getWaitingCount(),
            this.notificationsQueue.getActiveCount(),
            this.notificationsQueue.getCompletedCount(),
            this.notificationsQueue.getFailedCount(),
            this.notificationsQueue.getDelayedCount()
        ]);

        return {
            waiting,
            active,
            completed,
            failed,
            delayed,
            timestamp: new Date()
        };
    }
}