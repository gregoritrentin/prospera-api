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
    ) {
        this.queues = new Map([
            ['email', emailQueue],
            ['boleto', boletoQueue],
            ['invoice', invoiceQueue],
        ]);
        this.setupEventListeners();
    }

    async addJob<T = any>(
        queueName: string,
        jobName: string,
        data: any
    ): Promise<QueueJobResult<T>> {
        const queue = this.queues.get(queueName);

        if (!queue) {
            throw new Error(`Queue ${queueName} not found`);
        }

        const job = await queue.add(jobName, data);
        this.logger.log(`Job added to queue ${queueName}: ${job.id}`);

        return {
            jobId: job.id.toString()
        };
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