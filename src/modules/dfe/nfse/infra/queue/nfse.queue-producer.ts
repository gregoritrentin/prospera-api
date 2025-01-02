import { Injectable, Logger } from '@nestjs/common'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'

// s@shar@core/inf@shar@core/nf@shar@core/queu@shar@core/nfse-queue-producer.ts

interface TransmitJobData {
    businessId: string;
    nfseId: string;
    language?: string;
    attempt?: number;
}

interface QueryJobData {
    businessId: string;
    nfseId: string;
    protocol?: string;
    attempt?: number;
}

@Injectable()
export class NfseQueueProducer {
    private readonly logger = new Logger(NfseQueueProducer.name);

    constructor(
        @InjectQueue('nfse') private nfseQueue: Queue
    ) {
        this.setupEventListeners();
    }

    async addTransmitNfseJob(data: TransmitJobData) {
        try {
            const job = await this.nfseQueue.add('transmit-nfse', {
                ...data,
                attempt: data.attempt || 1
            }, {
                attempts: 3,
                backoff: {
                    type: 'exponential',
                    delay: 5000
                },
                removeOnComplete: true,
                removeOnFail: false
            });

            this.logger.log(`Transmit NFSe job added to queue: ${job.id}`, {
                businessId: data.businessId,
                nfseId: data.nfseId,
                jobId: job.id
            });

            return job;
        } catch (error) {
            this.logger.error('Error adding transmit job to queue', {
                error: error instanceof Error ? error.message : 'Unknown error',
                data
            });
            throw error;
        }
    }

    async addQueryNfseJob(data: QueryJobData) {
        try {
            const job = await this.nfseQueue.add('query-nfse', {
                ...data,
                attempt: data.attempt || 1
            }, {
                delay: 30000,
                attempts: 10,
                backoff: {
                    type: 'fixed',
                    delay: 30000
                },
                removeOnComplete: true,
                removeOnFail: false
            });

            this.logger.log(`Query NFSe job added to queue: ${job.id}`, {
                businessId: data.businessId,
                nfseId: data.nfseId,
                protocol: data.protocol,
                jobId: job.id
            });

            return job;
        } catch (error) {
            this.logger.error('Error adding query job to queue', {
                error: error instanceof Error ? error.message : 'Unknown error',
                data
            });
            throw error;
        }
    }

    private setupEventListeners() {
        this.nfseQueue.on('completed', (job) => {
            this.logger.log(`Job completed successfully: ${job.id}`, {
                jobName: job.name,
                data: job.data
            });
        });

        this.nfseQueue.on('failed', (job, error) => {
            this.logger.error(`Job failed: ${job.id}`, {
                jobName: job.name,
                data: job.data,
                error: error.message,
                attempts: job.attemptsMade
            });
        });

        this.nfseQueue.on('stalled', (job) => {
            this.logger.warn(`Job stalled: ${job.id}`, {
                jobName: job.name,
                data: job.data
            });
        });
    }

    async getQueueMetrics() {
        const [waiting, active, completed, failed, delayed] = await Promise.all([
            this.nfseQueue.getWaitingCount(),
            this.nfseQueue.getActiveCount(),
            this.nfseQueue.getCompletedCount(),
            this.nfseQueue.getFailedCount(),
            this.nfseQueue.getDelayedCount()
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