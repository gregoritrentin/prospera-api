import { Process, Processor, InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { EmailProvider } from '@/domain/interfaces/email-provider';
import { EmailRepository } from '@/domain/email/repositories/email-repository';
import { Email } from '@/domain/email/entities/email';

interface EmailJobData {
    to: string;
    subject: string;
    body: string;
}

@Injectable()
@Processor('email')
export class EmailQueueConsumer {
    private readonly logger = new Logger(EmailQueueConsumer.name);

    constructor(
        private emailProvider: EmailProvider,
        private emailRepository: EmailRepository,
        @InjectQueue('email') private emailQueue: Queue
    ) {
        this.logger.log('EmailQueueConsumer initialized');
        this.setupEventListeners();
    }

    @Process('send-email')
    async handleSendEmail(job: Job<EmailJobData>) {
        this.logger.log(`Processing job ${job.id}`);
        const { to, subject, body } = job.data;

        try {
            // Criar a entidade de email
            const email = Email.create({
                to,
                subject,
                body,
                status: 'PENDING',
            });

            // Salvar o email no banco de dados
            this.logger.log(`Saving email to database for job ${job.id}`);
            await this.emailRepository.create(email);

            // Enviar o email
            this.logger.log(`Sending email to ${to} for job ${job.id}`);
            await this.emailProvider.send({ to, subject, body });

            this.logger.log(`Job ${job.id} completed successfully. Email sent, awaiting webhook confirmation.`);
            return { success: true, emailId: email.id };
        } catch (error) {
            const err = error as Error;
            this.logger.error(`Error processing job ${job.id}: ${err.message}`, err.stack);

            throw error;
        }
    }

    private setupEventListeners() {
        this.emailQueue.on('completed', (job) => {
            this.logger.log(`Job ${job.id} completed`);
        });

        this.emailQueue.on('failed', (job, err) => {
            this.logger.error(`Job ${job.id} failed with error: ${err.message}`);
        });

        this.emailQueue.on('error', (error) => {
            this.logger.error(`Queue error: ${error.message}`, error.stack);
        });

        this.emailQueue.on('waiting', (jobId) => {
            this.logger.log(`Job ${jobId} is waiting`);
        });

        this.emailQueue.on('active', (job) => {
            this.logger.log(`Job ${job.id} has started`);
        });

        this.emailQueue.on('stalled', (job) => {
            this.logger.warn(`Job ${job.id} has stalled`);
        });

        this.emailQueue.on('progress', (job, progress) => {
            this.logger.log(`Job ${job.id} is ${progress}% complete`);
        });

        // Adicionar listeners para o cliente Redis
        this.emailQueue.client.on('connect', () => {
            this.logger.log('Redis client connected');
        });

        this.emailQueue.client.on('error', (error) => {
            this.logger.error(`Redis client error: ${error.message}`, error.stack);
        });

        this.emailQueue.client.on('ready', () => {
            this.logger.log('Redis client is ready');
        });

        // Log das opções de conexão do Redis
        this.logger.debug(`Redis connection options: ${JSON.stringify(this.emailQueue.client.options)}`);
    }
}