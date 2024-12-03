// src/infra/queues/bull-queue.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { QueueProvider, QueueJobResult } from '@/domain/interfaces/queue-provider';

@Injectable()
export class BullQueueService implements QueueProvider {
    private readonly logger = new Logger(BullQueueService.name);
    private queues: Map<string, Queue>;

    constructor(
        @InjectQueue('email') private emailQueue: Queue,
        @InjectQueue('boleto') private boletoQueue: Queue,
        @InjectQueue('invoice') private invoiceQueue: Queue,
        @InjectQueue('subscription-invoice') private subscriptionInvoiceQueue: Queue,
    ) {
        this.queues = new Map([
            ['email', emailQueue],
            ['boleto', boletoQueue],
            ['invoice', invoiceQueue],
            ['subscription-invoice', subscriptionInvoiceQueue],
        ]);
        this.setupEventListeners();
    }

    async addJob<T = any>(
        queueName: string,
        jobName: string,
        data: any
    ): Promise<QueueJobResult<T>> {
        try {
            const queue = this.queues.get(queueName);

            if (!queue) {
                this.logger.error(`Queue ${queueName} not found. Available queues: ${Array.from(this.queues.keys()).join(', ')}`);
                throw new Error(`Queue ${queueName} not found`);
            }

            this.logger.debug(`Adding job to queue ${queueName}:`, { jobName, data });

            const job = await queue.add(jobName, data, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 1000,
                },
            });

            this.logger.log(`Job successfully added to queue ${queueName}: ${job.id}`);

            return {
                jobId: job.id.toString()
            };
        } catch (error) {
            this.logger.error(`Failed to add job to queue ${queueName}:`, error);
            throw error;
        }
    }

    private setupEventListeners() {
        for (const [queueName, queue] of this.queues) {
            queue.on('global:completed', (jobId) => {
                this.logger.log(`Job ${jobId} completed on queue ${queueName}`);
            });

            queue.on('global:failed', (jobId, err) => {
                this.logger.error(`Job ${jobId} failed on queue ${queueName} with error: ${err.message}`);
            });

            queue.on('global:stalled', (jobId) => {
                this.logger.warn(`Job ${jobId} is stalled on queue ${queueName}`);
            });

            queue.on('global:progress', (jobId, progress) => {
                this.logger.log(`Job ${jobId} is ${progress}% complete on queue ${queueName}`);
            });
        }
    }
}