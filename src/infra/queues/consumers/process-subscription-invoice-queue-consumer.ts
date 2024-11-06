import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';
import { Either, left, right } from '@/core/either';
import { SubscriptionRepository } from '@/domain//subscription/repositories/subscription-repository';
import { CreateInvoiceQueueProducer } from '@/infra/queues/producers/create-invoice-queue-producer';
import { Subscription } from '@/domain/subscription/entities/subscription';
import { RedisIdempotencyRepository } from '@/infra/database/redis/repositories/redis-idempotency-repository';
import { RedisRateLimitRepository } from '@/infra/database/redis/repositories/redis-rate-limit-repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { addMonths } from 'date-fns';
import { InvoiceStatus, PaymentMethod, CalculationMode, YesNo } from '@/core/types/enums';

interface ProcessInvoiceSubscriptionJobData {
    startDate: Date;
    endDate: Date;
    language: Language | string;
}

interface ProcessedSubscription {
    subscriptionId: string;
    invoiceJobId: string;
    nextBillingDate: Date;
}

@Injectable()
@Processor('invoice-subscription')
export class ProcessInvoiceSubscriptionQueueConsumer {
    private readonly logger = new Logger(ProcessInvoiceSubscriptionQueueConsumer.name);

    constructor(
        private readonly subscriptionRepository: SubscriptionRepository,
        private readonly i18nService: I18nService,
        private readonly createInvoiceProducer: CreateInvoiceQueueProducer,
        private readonly idempotencyRepository: RedisIdempotencyRepository,
        private readonly rateLimitRepository: RedisRateLimitRepository,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    @Process('process-invoice-subscription')
    async handleProcessInvoiceSubscription(
        job: Job<ProcessInvoiceSubscriptionJobData>
    ): Promise<Either<AppError, { processedSubscriptions: ProcessedSubscription[]; message: string }>> {
        const startTime = Date.now();
        this.logger.log(`Processing invoice subscription job ${job.id}`);

        try {
            // 1. Verificar idempotência
            const result = await this.idempotencyRepository.processIdempotently<Either<AppError, { processedSubscriptions: ProcessedSubscription[]; message: string }>>(
                `invoice-subscription:${job.id}`,
                async () => {
                    // 2. Verificar rate limit global
                    const rateLimit = await this.rateLimitRepository.checkAndIncrement(
                        'invoice-subscription',
                        'global'
                    );

                    if (!rateLimit.allowed) {
                        const delay = (rateLimit.resetTime - Date.now() / 1000) * 1000;
                        await job.retry();

                        return left(AppError.rateLimitExceeded(
                            this.i18nService.translate('errors.RATE_LIMIT_EXCEEDED', job.data.language, {
                                retryAfter: Math.ceil(delay / 1000)
                            })
                        ));
                    }

                    // 3. Processar assinaturas
                    const result = await this.processSubscriptions(job);

                    // 4. Registrar métricas e eventos
                    const duration = Date.now() - startTime;
                    this.eventEmitter.emit('invoice-subscription.processed', {
                        processedCount: result.isRight() ? result.value.processedSubscriptions.length : 0,
                        duration,
                        success: result.isRight()
                    });

                    return result;
                },
                {
                    ttl: 24 * 60 * 60,
                    metadata: {
                        jobId: job.id,
                        dateRange: `${job.data.startDate}-${job.data.endDate}`
                    }
                }
            );

            return result;

        } catch (error) {
            const duration = Date.now() - startTime;

            this.eventEmitter.emit('invoice-subscription.failed', {
                jobId: job.id,
                error: error instanceof Error ? error.message : String(error),
                duration
            });

            this.logger.error(
                `Error processing invoice subscription job ${job.id}:`,
                error instanceof Error ? error.message : String(error)
            );

            return left(AppError.internalServerError(
                this.i18nService.translate('errors.SUBSCRIPTION_PROCESSING_FAILED', job.data.language, {
                    errorDetail: error instanceof Error ? error.message : 'Unknown error'
                })
            ));
        }
    }

    private async processSubscriptions(
        job: Job<ProcessInvoiceSubscriptionJobData>
    ): Promise<Either<AppError, { processedSubscriptions: ProcessedSubscription[]; message: string }>> {
        try {
            // 1. Buscar assinaturas ativas com nextBillingDate no intervalo
            const subscriptions = await this.subscriptionRepository.findManyByNextBillingDateRange(
                job.data.startDate,
                job.data.endDate
            );

            const processedSubscriptions: ProcessedSubscription[] = [];

            // 2. Processar cada assinatura
            for (const subscription of subscriptions) {
                try {
                    // Criar invoice para a assinatura
                    const invoiceJobResult = await this.createInvoiceFromSubscription(
                        subscription,
                        job.data.language
                    );

                    if (invoiceJobResult.isRight()) {
                        // Atualizar nextBillingDate da assinatura
                        const nextBillingDate = this.calculateNextBillingDate(subscription);
                        subscription.nextBillingDate = nextBillingDate;

                        await this.subscriptionRepository.save(subscription);

                        processedSubscriptions.push({
                            subscriptionId: subscription.id.toString(),
                            invoiceJobId: invoiceJobResult.value.jobId,
                            nextBillingDate
                        });

                        // Emitir evento de sucesso
                        this.eventEmitter.emit('subscription.invoice-created', {
                            subscriptionId: subscription.id.toString(),
                            invoiceJobId: invoiceJobResult.value.jobId,
                            nextBillingDate
                        });
                    }
                } catch (error) {
                    this.logger.error(
                        `Error processing subscription ${subscription.id.toString()}:`,
                        error instanceof Error ? error.message : String(error)
                    );

                    // Emitir evento de falha
                    this.eventEmitter.emit('subscription.invoice-failed', {
                        subscriptionId: subscription.id.toString(),
                        error: error instanceof Error ? error.message : String(error)
                    });
                }
            }

            return right({
                processedSubscriptions,
                message: this.i18nService.translate('messages.SUBSCRIPTION_INVOICES_PROCESSED', job.data.language, {
                    count: processedSubscriptions.length
                })
            });

        } catch (error) {
            this.logger.error(`Error processing subscriptions:`,
                error instanceof Error ? error.message : String(error)
            );
            throw error;
        }
    }

    private async createInvoiceFromSubscription(
        subscription: Subscription,
        language: Language | string
    ) {
        return await this.createInvoiceProducer.addCreateInvoiceJob({
            request: {
                businessId: subscription.businessId.toString(),
                personId: subscription.personId.toString(),
                description: subscription.notes || undefined,
                notes: `Fatura referente à assinatura ${subscription.id.toString()}`,
                paymentLink: '', // Será gerado pelo create-invoice
                status: InvoiceStatus.PENDING,
                issueDate: new Date(),
                dueDate: subscription.nextBillingDate,
                paymentDate: new Date(),
                grossAmount: subscription.price,
                discountAmount: 0,
                amount: subscription.price,
                paymentAmount: subscription.price,
                protestMode: YesNo.NO,
                protestDays: 0,
                lateMode: CalculationMode.NONE,
                lateValue: 0,
                interestMode: CalculationMode.NONE,
                interestDays: 0,
                interestValue: 0,
                discountMode: CalculationMode.NONE,
                discountDays: 0,
                discountValue: 0,

                items: subscription.items.map(item => ({
                    itemId: item.id.toString(),
                    itemDescription: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    discount: item.discount,
                    totalPrice: item.quantity * item.unitPrice //- item.discount
                })),

                splits: subscription.splits.map(split => ({
                    recipientId: split.recipientId.toString(),
                    splitType: split.splitType as unknown as CalculationMode,
                    amount: split.amount,
                    feeAmount: split.feeAmount
                })),

                payments: [{
                    dueDate: subscription.nextBillingDate,
                    amount: subscription.price,
                    paymentMethod: subscription.paymentMethod as PaymentMethod
                }]
            },
            language
        });
    }

    private calculateNextBillingDate(subscription: Subscription): Date {
        const currentBillingDate = subscription.nextBillingDate;

        switch (subscription.interval) {
            case 'MONTHLY':
                return addMonths(currentBillingDate, 1);
            case 'QUARTERLY':
                return addMonths(currentBillingDate, 3);
            case 'SEMIANNUAL':
                return addMonths(currentBillingDate, 6);
            case 'ANNUAL':
                return addMonths(currentBillingDate, 12);
            default:
                return addMonths(currentBillingDate, 1);
        }
    }
}