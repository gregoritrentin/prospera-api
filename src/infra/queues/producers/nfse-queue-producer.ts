// src/infra/nfse/queues/producers/nfse-queue-producer.ts

import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { NfseEvent } from '@/domain/dfe/nfse/entities/nfse-event';
import {
    NfseEventStatus,
    NfseEventType
} from '@/core/types/enums';

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
                    delay: 5000 // 5 segundos inicial
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
                delay: 30000, // 30 segundos de delay inicial
                attempts: 10, // Máximo de 10 tentativas
                backoff: {
                    type: 'fixed',
                    delay: 30000 // 30 segundos entre tentativas
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

    async addBatchTransmitNfseJob(data: TransmitJobData[]) {
        try {
            const jobs = await Promise.all(
                data.map(item => this.addTransmitNfseJob(item))
            );

            this.logger.log(`Batch transmit jobs added to queue`, {
                count: jobs.length,
                jobIds: jobs.map(job => job.id)
            });

            return jobs;
        } catch (error) {
            this.logger.error('Error adding batch transmit jobs to queue', {
                error: error instanceof Error ? error.message : 'Unknown error',
                count: data.length
            });
            throw error;
        }
    }

    async getJobStatus(jobId: string) {
        try {
            const job = await this.nfseQueue.getJob(jobId);
            if (!job) {
                return {
                    found: false
                };
            }

            const state = await job.getState();
            const progress = await job.progress();

            return {
                found: true,
                state,
                progress,
                attempts: job.attemptsMade,
                data: job.data
            };
        } catch (error) {
            this.logger.error('Error getting job status', {
                error: error instanceof Error ? error.message : 'Unknown error',
                jobId
            });
            throw error;
        }
    }

    async removeJob(jobId: string) {
        try {
            const job = await this.nfseQueue.getJob(jobId);
            if (job) {
                await job.remove();
                this.logger.log(`Job removed from queue: ${jobId}`);
            }
        } catch (error) {
            this.logger.error('Error removing job', {
                error: error instanceof Error ? error.message : 'Unknown error',
                jobId
            });
            throw error;
        }
    }

    async cleanQueue() {
        try {
            await this.nfseQueue.clean(0, 'completed');
            await this.nfseQueue.clean(0, 'failed');
            this.logger.log('Queue cleaned successfully');
        } catch (error) {
            this.logger.error('Error cleaning queue', {
                error: error instanceof Error ? error.message : 'Unknown error'
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

        this.nfseQueue.on('error', (error) => {
            this.logger.error('Queue error', {
                error: error.message
            });
        });
    }

    // Métodos úteis para monitoramento
    async getQueueMetrics() {
        const [
            waiting,
            active,
            completed,
            failed,
            delayed
        ] = await Promise.all([
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