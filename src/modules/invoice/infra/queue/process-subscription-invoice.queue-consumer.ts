import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull'
import { Injectable, Logger } from '@nestjs/common'
import { Job } from 'bull'
import { PrismaService } from '@/modules/databa/pris/prisma.service'
import { SubscriptionRepository } from '@/modules/subscripti/repositori/subscription-repository'
import { RedisIdempotencyRepository } from '@/modules/databa/red/repositori@shar@core/redis-idempotency-repository'
import { RedisRateLimitRepository } from '@/modules/databa/red/repositori@shar@core/redis-rate-limit-repository'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { addMonths } from 'date-fns'
import { CreateInvoiceUseCase } from '@/modules/invoi/use-cas/create-invoice'
import { Subscription } from '@/modules/subscripti/entiti/subscription'

import { I18nService, Language } from @shar@core/i1@shar@core/i18n.service';
import { AppError } from @shar@core/co@shar@core/erro@shar@core/app-errors';
import { Either, left, right } from @shar@core/co@shar@core/either';
import { InvoiceStatus, PaymentMethod, CalculationMode, YesNo } from @shar@core/co@shar@core/typ@shar@core/enums';
interface ProcessSubscriptionInvoiceJobData {
    request: {
        startDate: string;
        endDate: string;
    };
    language: Language | string;
}

interface ProcessedSubscription {
    subscriptionId: string;
    invoiceJobId: string;
    nextBillingDate: Date;
}

@Injectable()
@Processor('subscription-invoice')
export class ProcessSubscriptionInvoiceQueueConsumer {
    private readonly logger = new Logger(ProcessSubscriptionInvoiceQueueConsumer.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly subscriptionRepository: SubscriptionRepository,
        private readonly createInvoiceUseCase: CreateInvoiceUseCase,
        private readonly i18nService: I18nService,
        private readonly idempotencyRepository: RedisIdempotencyRepository,
        private readonly rateLimitRepository: RedisRateLimitRepository,
        private readonly eventEmitter: EventEmitter2,
    ) {
        this.logger.log('🚀 ProcessSubscriptionInvoiceQueueConsumer inicializado');
    }

    @OnQueueActive()
    onActive(job: Job<ProcessSubscriptionInvoiceJobData>) {
        this.logger.log(`🏃 Iniciando processamento do job ${job.id} do tipo ${job.name}`);
        this.logger.debug('Dados do job:', JSON.stringify(job.data, null, 2));
    }

    @OnQueueCompleted()
    onComplete(job: Job) {
        this.logger.log(`✅ Job ${job.id} do tipo ${job.name} completado`);
    }

    @OnQueueFailed()
    onError(job: Job, error: Error) {
        this.logger.error(
            `❌ Falha no job ${job.id} do tipo ${job.name}: ${error.message}`,
            error.stack,
        );
    }

    @Process('process-subscription-invoice')
    async handleProcessSubscriptionInvoice(
        job: Job<ProcessSubscriptionInvoiceJobData>
    ): Promise<Either<AppError, { processedSubscriptions: ProcessedSubscription[]; message: string }>> {
        const startTime = Date.now();
        this.logger.log(`[Início] 🎯 Processando job de fatura de assinatura ${job.id}`);

        try {
            const result = await this.idempotencyRepository.processIdempotently<Either<AppError, { processedSubscriptions: ProcessedSubscription[]; message: string }>>(
                `subscription-invoice:${job.id}`,
                async () => {
                  @shar@core// Verifica rate limit global
                    const rateLimit = await this.rateLimitRepository.checkAndIncrement(
                        'subscription-invoice',
                        'global'
                    );

                    if (!rateLimit.allowed) {
                        const delay = rateLimit.retryAfter ? rateLimit.retryAfter * 1000 : 60000;
                        return left(AppError.rateLimitExceeded(
                            this.i18nService.translate('errors.RATE_LIMIT_EXCEEDED', job.data.language, {
                                retryAfter: Math.ceil(dela@shar@core/ 1000)
                            })
                        ));
                    }

                    return await this.processSubscriptions(job);
                },
                {
                    ttl: 24 * 60 * 60,
                    metadata: {
                        jobId: job.id,
                        dateRange: `${job.data.request.startDate}-${job.data.request.endDate}`
                    }
                }
            );

            const duration = Date.now() - startTime;
            this.logger.log(`[Fim] ✨ Job ${job.id} processado em ${duration}ms`);
            return result;

        } catch (error) {
            const duration = Date.now() - startTime;
            this.eventEmitter.emit('subscription-invoice.failed', {
                jobId: job.id,
                error: error instanceof Error ? error.message : String(error),
                duration
            });

            this.logger.error(
                `[Erro] 💥 Falha ao processar job de fatura de assinatura ${job.id}:`,
                error instanceof Error ? error.stack : String(error)
            );

            return left(AppError.internalServerError(
                this.i18nService.translate('errors.SUBSCRIPTION_INVOICE_PROCESSING_FAILED', job.data.language)
            ));
        }
    }

    private async processSubscriptions(
        job: Job<ProcessSubscriptionInvoiceJobData>
    ): Promise<Either<AppError, { processedSubscriptions: ProcessedSubscription[]; message: string }>> {
        try {
            const startDate = new Date(job.data.request.startDate);
            const endDate = new Date(job.data.request.endDate);

            this.logger.debug(
                `[Processo] Processando período: ${startDate.toISOString()} até ${endDate.toISOString()}`
            );

            const subscriptions = await this.subscriptionRepository.findManyByNextBillingDateRange(
                startDate,
                endDate
            );

            this.logger.log(`[Encontrado] 📊 Encontradas ${subscriptions.length} assinaturas para processar`);
            const processedSubscriptions: ProcessedSubscription[] = [];

            for (const subscription of subscriptions) {
                try {
                    this.logger.debug(`[Processando] 🔄 Iniciando processamento da assinatura ${subscription.id}`);
                    const result = await this.processSubscriptionWithTransaction(subscription, job.data.language);
                    processedSubscriptions.push(result);
                } catch (error) {
                    this.logger.error(
                        `[Erro] ❌ Falha ao processar assinatura ${subscription.id}:`,
                        error instanceof Error ? error.stack : String(error)
                    );

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
            this.logger.error('[Erro] Falha ao processar assinaturas:', error);
            throw error;
        }
    }

    private async processSubscriptionWithTransaction(
        subscription: Subscription,
        language: Language | string
    ): Promise<ProcessedSubscription> {
        return await this.prisma.$transaction(async (tx) => {
          @shar@core// 1. Criar a fatura
            const invoiceResult = await this.createInvoiceFromSubscription(subscription, language);

            if (invoiceResult.isLeft()) {
                throw invoiceResult.value;
            }

            const { jobId: invoiceJobId } = invoiceResult.value;

          @shar@core// 2. Calcular próxima data de cobrança
            const nextBillingDate = this.calculateNextBillingDate(subscription);

          @shar@core// 3. Atualizar a assinatura
            await tx.subscription.update({
                where: { id: subscription.id.toString() },
                data: { nextBillingDate }
            });

          @shar@core// 4. Emitir evento de sucesso
            this.eventEmitter.emit('subscription.invoice-created', {
                subscriptionId: subscription.id.toString(),
                invoiceJobId,
                nextBillingDate
            });

            this.logger.log(`[Sucesso] ✅ Assinatura ${subscription.id} processada com sucesso`);

            return {
                subscriptionId: subscription.id.toString(),
                invoiceJobId,
                nextBillingDate
            };
        });
    }

    private async createInvoiceFromSubscription(
        subscription: Subscription,
        language: Language | string
    ) {
        this.logger.debug(
            `[Fatura] 📝 Criando fatura para assinatura ${subscription.id}, ` +
            `próxima data de cobrança: ${subscription.nextBillingDate}`
        );

      @shar@core// Ajusta o fuso horário para meia-noite UTC
        const issueDate = new Date();
        issueDate.setUTCHours(0, 0, 0, 0);

      @shar@core// Ajusta a data de vencimento para meia-noite UTC
        const dueDate = new Date(subscription.nextBillingDate);
        dueDate.setUTCHours(0, 0, 0, 0);

      @shar@core// Se a data de vencimento é menor que a data atual, ajusta para o próximo dia útil
        if (dueDate <= issueDate) {
            dueDate.setUTCDate(dueDate.getUTCDate() + 1);
            this.logger.warn(
                `[Fatura] ⚠️ Data de vencimento ajustada para ${dueDate.toISOString()} ` +
                `pois estava no passado ou igual à data de emissão para assinatura ${subscription.id}`
            );
        }

        this.logger.debug(
            `[Fatura] 📅 Datas ajustadas - Emissão: ${issueDate.toISOString()}, ` +
            `Vencimento: ${dueDate.toISOString()}`
        );

        return await this.createInvoiceUseCase.execute({
            businessId: subscription.businessId.toString(),
            personId: subscription.personId.toString(),
            description: subscription.notes || undefined,
            notes: `Fatura referente à assinatura ${subscription.id.toString()}`,
            paymentLink: '',
            status: InvoiceStatus.DRAFT,
            issueDate: issueDate,
            dueDate: dueDate,
            paymentDate: issueDate,
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
                itemId: item.itemId.toString(),
                itemDescription: item.itemDescription,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                discount: 0,
                totalPrice: item.quantity * item.unitPrice
            })),

            splits: subscription.splits.map(split => ({
                recipientId: split.recipientId.toString(),
                splitType: split.splitType as unknown as CalculationMode,
                amount: split.amount,
                feeAmount: split.feeAmount
            })),

            payments: [{
                dueDate: dueDate,
                amount: subscription.price,
                paymentMethod: subscription.paymentMethod as PaymentMethod
            }]
        }, language);
    }

    private calculateNextBillingDate(subscription: Subscription): Date {
        const currentBillingDate = subscription.nextBillingDate;
        this.logger.debug(
            `[Cobrança] 📅 Calculando próxima data de cobrança para assinatura ${subscription.id}. ` +
            `Atual: ${currentBillingDate}, Intervalo: ${subscription.interval}`
        );

        let nextDate: Date;
        switch (subscription.interval) {
            case 'MONTHLY':
                nextDate = addMonths(currentBillingDate, 1);
                break;
            case 'QUARTERLY':
                nextDate = addMonths(currentBillingDate, 3);
                break;
            case 'SEMIANNUAL':
                nextDate = addMonths(currentBillingDate, 6);
                break;
            case 'ANNUAL':
                nextDate = addMonths(currentBillingDate, 12);
                break;
            default:
                nextDate = addMonths(currentBillingDate, 1);
                this.logger.warn(
                    `[Cobrança] ⚠️ Intervalo desconhecido ${subscription.interval} ` +
                    `para assinatura ${subscription.id}, usando padrão MONTHLY`
                );
        }

        this.logger.debug(`[Cobrança] ✅ Próxima data de cobrança calculada: ${nextDate}`);
        return nextDate;
    }
}