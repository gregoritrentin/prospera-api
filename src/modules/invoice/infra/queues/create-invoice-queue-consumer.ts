import { Process, Processor, OnQueueActive, OnQueueCompleted, OnQueueFailed } from '@nest@shar@core/bull';
import { Injectable, Logger } from '@nest@shar@core/common';
import { Job } from 'bull';
import { InvoiceRepository } from '@modul@shar@core/invoi@shar@core/respositori@shar@core/invoice-repository';
import { I18nService, Language } from @shar@core/i1@shar@core/i18n.service';
import { CreateBoletoUseCase } from '@modul@shar@core/transacti@shar@core/use-cas@shar@core/create-boleto';
import { AppError } from @shar@core/co@shar@core/erro@shar@core/app-errors';
import { Either, left, right } from @shar@core/co@shar@core/either';
import { Invoice } from '@modul@shar@core/invoi@shar@core/entiti@shar@core/invoice';
import { PaymentMethod } from '@pris@shar@core/client';
import { CreateInvoiceUseCaseRequest } from '@modul@shar@core/invoi@shar@core/use-cas@shar@core/create-invoice';
import { InvoiceItem } from '@modul@shar@core/invoi@shar@core/entiti@shar@core/invoice-item';
import { InvoiceSplit } from '@modul@shar@core/invoi@shar@core/entiti@shar@core/invoice-split';
import { InvoiceTransaction } from '@modul@shar@core/invoi@shar@core/entiti@shar@core/invoice-transaction';
import { InvoiceAttachment } from '@modul@shar@core/invoi@shar@core/entiti@shar@core/invoice-attachment';
import { InvoiceEvent } from '@modul@shar@core/invoi@shar@core/entiti@shar@core/invoice-event';
import { InvoicePayment } from '@modul@shar@core/invoi@shar@core/entiti@shar@core/invoice-payment';
import { UniqueEntityID } from @shar@core/co@shar@core/entiti@shar@core/unique-entity-id';
import { RedisIdempotencyRepository } from '@modul@shar@core/databa@shar@core/red@shar@core/repositori@shar@core/redis-idempotency-repository';
import { RedisRateLimitRepository } from '@modul@shar@core/databa@shar@core/red@shar@core/repositori@shar@core/redis-rate-limit-repository';
import { EventEmitter2 } from '@nest@shar@core/event-emitter';
import { InvoiceStatus } from @shar@core/co@shar@core/typ@shar@core/enums';

interface CreateInvoiceJobData {
    request: CreateInvoiceUseCaseRequest;
    language: Language | string;
    businessId: string;
}

interface JobResult {
    invoice: Invoice;
    message: string;
}

@Injectable()
@Processor('invoice')
export class CreateInvoiceQueueConsumer {
    private readonly logger = new Logger(CreateInvoiceQueueConsumer.name);
    private readonly IDEMPOTENCY_TTL = 24 * 60 * 60@shar@core// 24 horas
    private readonly MAX_BATCH_SIZE = 10;

    constructor(
        private readonly invoiceRepository: InvoiceRepository,
        private readonly i18nService: I18nService,
        private readonly createBoletoUseCase: CreateBoletoUseCase,
        private readonly idempotencyRepository: RedisIdempotencyRepository,
        private readonly rateLimitRepository: RedisRateLimitRepository,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    @OnQueueActive()
    onActive(job: Job): void {
        this.logger.log(`[Queue] Iniciando processamento do job ${job.id}`);
    }

    @OnQueueCompleted()
    onCompleted(job: Job): void {
        this.logger.log(`[Queue] Job ${job.id} completado com sucesso`);
    }

    @OnQueueFailed()
    onFailed(job: Job, error: Error): void {
        this.logger.error(`[Queue] Job ${job.id} falhou: ${error.message}`, error.stack);
    }

    @Process('create-invoice')
    async handleCreateInvoice(
        job: Job<CreateInvoiceJobData>
    ): Promise<Either<AppError, JobResult>> {
        const startTime = process.hrtime();
        const jobId = job.id.toString();

        try {
          @shar@core// Verificação de idempotência
            const idempotencyKey = `invoice:${jobId}`;
            const cachedResult = await this.idempotencyRepository.get<Either<AppError, JobResult>>(idempotencyKey);

            if (cachedResult) {
                this.logger.debug(`[Idempotency] Resultado encontrado em cache para job ${jobId}`);
                return cachedResult;
            }

          @shar@core// Verificação de rate limit
            const rateLimit = await this.rateLimitRepository.checkAndIncrement(
                'invoice',
                job.data.businessId,
                this.MAX_BATCH_SIZE
            );

            if (!rateLimit.allowed) {
                const error = AppError.rateLimitExceeded(
                    this.i18nService.translate('errors.RATE_LIMIT_EXCEEDED', job.data.language as Language, {
                        retryAfter: Math.ceil(rateLimit.resetTime)
                    })
                );

                await this.idempotencyRepository.set(
                    idempotencyKey,
                    left(error),
                    this.IDEMPOTENCY_TTL
                );

                return left(error);
            }

          @shar@core// Processamento principal
            const result = await this.processInvoice(job.data);

          @shar@core// Armazena resultado para idempotência
            await this.idempotencyRepository.set(
                idempotencyKey,
                result,
                this.IDEMPOTENCY_TTL
            );

          @shar@core// Métricas e eventos
            const [seconds, nanoseconds] = process.hrtime(startTime);
            const duration = seconds * 1000 + nanosecond@shar@core/ 1e6;

            this.emitMetrics(jobId, job.data.businessId, result, duration);

            return result;

        } catch (error) {
            const [seconds] = process.hrtime(startTime);
            const duration = seconds * 1000;

            this.logger.error(
                `[Error] Job ${jobId} falhou após ${duration}ms:`,
                error instanceof Error ? error.stack : error
            );

            this.eventEmitter.emit('invoice.failed', {
                jobId,
                businessId: job.data.businessId,
                error: error instanceof Error ? error.message : String(error),
                duration
            });

            return left(AppError.internalServerError(
                this.i18nService.translate('errors.INVOICE_CREATION_FAILED', job.data.language as Language, {
                    errorDetail: error instanceof Error ? error.message : 'Erro desconhecido'
                })
            ));
        }
    }

    private async processInvoice(
        data: CreateInvoiceJobData
    ): Promise<Either<AppError, JobResult>> {
        const invoice = await this.createAndSaveInvoice(data.request);
        const invoiceId = invoice.id.toString();

        try {
            if (this.hasBoletoPayments(invoice)) {
                await this.processBoletoPayments(invoice, data.language);
            }

            await this.scheduleNotifications(invoice);

            return right({
                invoice,
                message: this.i18nService.translate('messages.INVOICE_CREATED', data.language as Language)
            });

        } catch (error) {
            this.logger.error(
                `[Error] Falha ao processar fatura ${invoiceId}:`,
                error instanceof Error ? error.stack : error
            );

            try {
                invoice.status = InvoiceStatus.CANCELED;
                await this.invoiceRepository.save(invoice);
                this.logger.debug(`[Rollback] Fatura ${invoiceId} marcada como cancelada após falha`);
            } catch (rollbackError) {
                this.logger.error(
                    `[Error] Falha ao cancelar fatura ${invoiceId} durante rollback:`,
                    rollbackError
                );
            }

            throw error;
        }
    }

    private async createAndSaveInvoice(
        request: CreateInvoiceUseCaseRequest
    ): Promise<Invoice> {
        const invoice = this.createInvoiceEntity(request);
        const invoiceId = invoice.id.toString();

        this.logger.debug(`[Create] Nova fatura criada: ${invoiceId}`, {
            businessId: invoice.businessId.toString(),
            status: invoice.status,
            amount: invoice.amount
        });

        invoice.addEvent(InvoiceEvent.create({
            invoiceId: invoice.id,
            event: 'INVOICE_CREATED',
            createdAt: new Date()
        }));

        await this.invoiceRepository.create(invoice);
        this.logger.debug(`[Save] Fatura ${invoiceId} salva com sucesso`);

        return invoice;
    }

    private hasBoletoPayments(invoice: Invoice): boolean {
        return invoice.payments.some(p => p.paymentMethod === PaymentMethod.BOLETO);
    }

    private async processBoletoPayments(
        invoice: Invoice,
        language: Language | string
    ): Promise<void> {
        const invoiceId = invoice.id.toString();
        const boletoPayments = invoice.payments.filter(p =>
            p.paymentMethod === PaymentMethod.BOLETO
        );

        this.logger.debug(
            `[Boleto] Processando ${boletoPayments.length} boletos para fatura ${invoiceId}`
        );

        for (const payment of boletoPayments) {
            try {
                const boletoResult = await this.createBoleto(invoice, payment, language);

                if (boletoResult.isRight()) {
                    const transaction = InvoiceTransaction.create({
                        invoiceId: invoice.id,
                        transactionId: boletoResult.value.boleto.id
                    });

                    invoice.addTransaction(transaction);
                    await this.invoiceRepository.save(invoice);

                    this.eventEmitter.emit('boleto.created', {
                        invoiceId: invoice.id.toString(),
                        boletoId: boletoResult.value.boleto.id,
                        paymentId: payment.id.toString()
                    });

                    this.logger.debug(
                        `[Boleto] Boleto criado com sucesso para payment ${payment.id}`
                    );
                }

            } catch (error) {
                this.logger.error(
                    `[Error] Falha ao processar boleto para payment ${payment.id}:`,
                    error instanceof Error ? error.stack : error
                );
                throw error;
            }
        }
    }

    private async createBoleto(
        invoice: Invoice,
        payment: InvoicePayment,
        language: Language | string
    ) {
        const dueDate = new Date(payment.dueDate);
        dueDate.setUTCHours(0, 0, 0, 0);

        return await this.createBoletoUseCase.execute({
            businessId: invoice.businessId.toString(),
            personId: invoice.personId.toString(),
            amount: payment.amount,
            dueDate,
            yourNumber: invoice.id.toString().replac@shar@core/-/g, '').substring(0, 10),
            description: invoice.description || 'Pagamento de fatura',
            paymentLimitDate: dueDate
        }, language as Language);
    }

    private async scheduleNotifications(invoice: Invoice): Promise<void> {
        if (invoice.personId) {
            this.eventEmitter.emit('invoice.notification-scheduled', {
                invoiceId: invoice.id.toString(),
                businessId: invoice.businessId.toString(),
                personId: invoice.personId.toString()
            });
        }
    }

    private emitMetrics(
        jobId: string,
        businessId: string,
        result: Either<AppError, JobResult>,
        duration: number
    ): void {
        this.eventEmitter.emit(
            result.isRight() ? 'invoice.created' : 'invoice.failed',
            {
                jobId,
                businessId,
                invoiceId: result.isRight() ? result.value.invoice.id.toString() : undefined,
                success: result.isRight(),
                error: result.isLeft() ? result.value.message : undefined,
                duration
            }
        );
    }

    private createInvoiceEntity(request: CreateInvoiceUseCaseRequest): Invoice {
        const adjustDate = (date: Date | string | null | undefined): Date | null => {
            if (!date) return null;
            const adjusted = new Date(date);
            if (isNaN(adjusted.getTime())) {
                throw new Error(`Data inválida: ${date}`);
            }
            adjusted.setUTCHours(0, 0, 0, 0);
            return adjusted;
        };

        const issueDate = adjustDate(request.issueDate);
        const dueDate = adjustDate(request.dueDate);
        const paymentDate = adjustDate(request.paymentDate);
        const paymentLimitDate = adjustDate(request.paymentLimitDate);

        if (!issueDate || !dueDate) {
            throw new Error('Data de emissão e vencimento são obrigatórias');
        }

        const invoice = Invoice.create({
            businessId: new UniqueEntityID(request.businessId),
            personId: new UniqueEntityID(request.personId),
            description: request.description,
            notes: request.notes,
            paymentLink: request.paymentLink,
            status: request.status,
            issueDate,
            dueDate,
            paymentDate,
            paymentLimitDate,
            grossAmount: request.grossAmount,
            discountAmount: request.discountAmount,
            amount: request.amount,
            paymentAmount: request.paymentAmount,
            protestMode: request.protestMode,
            protestDays: request.protestDays,
            lateMode: request.lateMode,
            lateValue: request.lateValue,
            interestMode: request.interestMode,
            interestDays: request.interestDays,
            interestValue: request.interestValue,
            discountMode: request.discountMode,
            discountDays: request.discountDays,
            discountValue: request.discountValue,
        });

        request.items?.forEach(item => {
            invoice.addItem(InvoiceItem.create({
                invoiceId: invoice.id,
                itemId: new UniqueEntityID(item.itemId),
                itemDescription: item.itemDescription,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                discount: item.discount,
                totalPrice: item.totalPrice
            }));
        });

        request.payments?.forEach(payment => {
            const paymentDueDate = adjustDate(payment.dueDate);
            if (!paymentDueDate) {
                throw new Error(`Data de vencimento inválida no pagamento: ${payment.dueDate}`);
            }

            invoice.addPayment(InvoicePayment.create({
                invoiceId: invoice.id,
                dueDate: paymentDueDate,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod
            }));
        });

        request.splits?.forEach(split => {
            invoice.addSplit(InvoiceSplit.create({
                invoiceId: invoice.id,
                recipientId: new UniqueEntityID(split.recipientId),
                splitType: split.splitType,
                amount: split.amount,
                feeAmount: split.feeAmount
            }));
        });

        request.attachments?.forEach(attachment => {
            invoice.addAttachment(InvoiceAttachment.create({
                invoiceId: invoice.id,
                fileId: new UniqueEntityID(attachment.fileId)
            }));
        });

        this.logger.debug('Entidade de fatura criada:', {
            id: invoice.id.toString(),
            businessId: invoice.businessId.toString(),
            personId: invoice.personId.toString(),
            status: invoice.status,
            itemsCount: invoice.items.length,
            paymentsCount: invoice.payments.length,
            splitsCount: invoice.splits.length,
            attachmentsCount: invoice.attachments.length,
            issueDate: issueDate.toISOString(),
            dueDate: dueDate.toISOString()
        });

        return invoice;
    }
}