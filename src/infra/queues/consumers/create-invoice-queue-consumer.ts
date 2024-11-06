// src/infra/queues/consumers/create-invoice-queue-consumer.ts
import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InvoiceRepository } from '@/domain/invoice/respositories/invoice-repository';
import { I18nService, Language } from '@/i18n/i18n.service';
import { CreateBoletoUseCase } from '@/domain/transaction/use-cases/create-boleto';
import { AppError } from '@/core/errors/app-errors';
import { Either, left, right } from '@/core/either';
import { Invoice } from '@/domain/invoice/entities/invoice';
import { PaymentMethod } from '@prisma/client';
import { CreateInvoiceUseCaseRequest } from '@/domain/invoice/use-cases/create-invoice';
import { InvoiceItem } from '@/domain/invoice/entities/invoice-item';
import { InvoiceSplit } from '@/domain/invoice/entities/invoice-split';
import { InvoiceTransaction } from '@/domain/invoice/entities/invoice-transaction';
import { InvoiceAttachment } from '@/domain/invoice/entities/invoice-attachment';
import { InvoiceEvent } from '@/domain/invoice/entities/invoice-event';
import { InvoicePayment } from '@/domain/invoice/entities/invoice-payment';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { RedisIdempotencyRepository } from '@/infra/database/redis/repositories/redis-idempotency-repository';
import { RedisRateLimitRepository } from '@/infra/database/redis/repositories/redis-rate-limit-repository';
import { EventEmitter2 } from '@nestjs/event-emitter';

interface CreateInvoiceJobData {
    request: CreateInvoiceUseCaseRequest;
    language: Language | string;
    businessId: string;
}

@Injectable()
@Processor('invoice')
export class CreateInvoiceQueueConsumer {
    private readonly logger = new Logger(CreateInvoiceQueueConsumer.name);

    constructor(
        private readonly invoiceRepository: InvoiceRepository,
        private readonly i18nService: I18nService,
        private readonly createBoletoUseCase: CreateBoletoUseCase,
        private readonly idempotencyRepository: RedisIdempotencyRepository,
        private readonly rateLimitRepository: RedisRateLimitRepository,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    @Process('create-invoice')
    async handleCreateInvoice(
        job: Job<CreateInvoiceJobData>
    ): Promise<Either<AppError, { invoice: Invoice; message: string }>> {
        const startTime = Date.now();
        this.logger.log(`Processing create invoice job ${job.id}`);

        try {
            // 1. Verificar idempotência
            const result = await this.idempotencyRepository.processIdempotently<Either<AppError, { invoice: Invoice; message: string }>>(
                `invoice:${job.id}`,
                async () => {
                    // 2. Verificar rate limit
                    const rateLimit = await this.rateLimitRepository.checkAndIncrement(
                        'invoice',
                        job.data.businessId
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

                    // 3. Processar invoice
                    const result = await this.processInvoice(job);

                    // 4. Registrar métricas e eventos
                    const duration = Date.now() - startTime;
                    this.eventEmitter.emit('invoice.created', {
                        businessId: job.data.businessId,
                        invoiceId: result.isRight() ? result.value.invoice.id.toString() : undefined,
                        duration,
                        success: result.isRight()
                    });

                    return result;
                },
                {
                    ttl: 24 * 60 * 60,
                    metadata: {
                        businessId: job.data.businessId,
                        jobId: job.id
                    }
                }
            );

            return result; // Agora garantimos que sempre retorna um Either

        } catch (error) {
            const duration = Date.now() - startTime;

            this.eventEmitter.emit('invoice.failed', {
                businessId: job.data.businessId,
                jobId: job.id,
                error: error instanceof Error ? error.message : String(error),
                duration
            });

            this.logger.error(
                `Error processing invoice job ${job.id}:`,
                error instanceof Error ? error.message : String(error)
            );

            return left(AppError.internalServerError(
                this.i18nService.translate('errors.INVOICE_CREATION_FAILED', job.data.language, {
                    errorDetail: error instanceof Error ? error.message : 'Unknown error'
                })
            ));
        }
    }

    private async processInvoice(
        job: Job<CreateInvoiceJobData>
    ): Promise<Either<AppError, { invoice: Invoice; message: string }>> {
        try {
            // 1. Criar a invoice
            const invoice = this.createInvoiceEntity(job.data.request);

            // 2. Registrar evento de criação
            const event = InvoiceEvent.create({
                invoiceId: invoice.id,
                event: 'INVOICE_CREATED'
            });

            invoice.addEvent(event);

            // 3. Salvar a invoice
            await this.invoiceRepository.create(invoice);

            // 4. Processar boletos, se houverem
            await this.processBoletoPayments(invoice, job.data.language);

            // 5. Agendar notificações
            await this.scheduleNotifications(invoice);

            return right({
                invoice,
                message: this.i18nService.translate('messages.INVOICE_CREATED', job.data.language)
            });

        } catch (error) {
            this.logger.error(`Error processing invoice:`,
                error instanceof Error ? error.message : String(error)
            );
            throw error;
        }
    }

    private async processBoletoPayments(
        invoice: Invoice,
        language: Language | string
    ): Promise<void> {
        const boletoPayments = invoice.payments.filter(payment =>
            payment.paymentMethod === PaymentMethod.BOLETO
        );

        for (const payment of boletoPayments) {
            try {
                // Verificar rate limit específico para boletos
                const rateLimit = await this.rateLimitRepository.checkAndIncrement(
                    'boleto',
                    invoice.businessId.toString()
                );

                if (!rateLimit.allowed) {
                    this.logger.warn('Boleto rate limit exceeded, will retry later');
                    continue;
                }

                const boletoResult = await this.createBoletoUseCase.execute({
                    businessId: invoice.businessId.toString(),
                    personId: invoice.personId.toString(),
                    amount: payment.amount,
                    dueDate: payment.dueDate,
                    yourNumber: invoice.id.toString(),
                    description: invoice.description || 'Invoice payment',
                    paymentLimitDate: payment.dueDate,
                }, language as Language);

                if (boletoResult.isRight()) {
                    const { boleto } = boletoResult.value;

                    const invoiceTransaction = InvoiceTransaction.create({
                        invoiceId: invoice.id,
                        transactionId: new UniqueEntityID(boleto.id.toString())
                    });

                    invoice.addTransaction(invoiceTransaction);
                    await this.invoiceRepository.save(invoice);

                    this.logger.log(`Boleto created for invoice ${invoice.id}`);

                    this.eventEmitter.emit('boleto.created', {
                        invoiceId: invoice.id.toString(),
                        boletoId: boleto.id.toString()
                    });
                }
            } catch (error) {
                this.logger.error(
                    `Error creating boleto for invoice ${invoice.id}:`,
                    error instanceof Error ? error.message : String(error)
                );

                this.eventEmitter.emit('boleto.failed', {
                    invoiceId: invoice.id.toString(),
                    error: error instanceof Error ? error.message : String(error)
                });
            }
        }
    }

    private async scheduleNotifications(invoice: Invoice): Promise<void> {
        if (invoice.personId) {
            this.eventEmitter.emit('invoice.send-notifications', {
                invoiceId: invoice.id.toString(),
                businessId: invoice.businessId.toString(),
                personId: invoice.personId.toString()
            });
        }
    }

    private createInvoiceEntity(request: CreateInvoiceUseCaseRequest): Invoice {
        const invoice = Invoice.create({
            businessId: new UniqueEntityID(request.businessId),
            personId: new UniqueEntityID(request.personId),
            description: request.description,
            notes: request.notes,
            paymentLink: request.paymentLink,
            status: request.status,
            issueDate: request.issueDate,
            dueDate: request.dueDate,
            paymentDate: request.paymentDate,
            paymentLimitDate: request.paymentLimitDate,
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

        // Adicionar itens
        request.items?.forEach((item) => {
            const invoiceItem = InvoiceItem.create({
                invoiceId: invoice.id,
                itemId: new UniqueEntityID(item.itemId),
                itemDescription: item.itemDescription,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                discount: item.discount,
                totalPrice: item.totalPrice
            });

            invoice.addItem(invoiceItem);
        });

        // Adicionar pagamentos
        request.payments?.forEach((payment) => {
            const invoicePayment = InvoicePayment.create({
                invoiceId: invoice.id,
                dueDate: payment.dueDate,
                amount: payment.amount,
                paymentMethod: payment.paymentMethod
            });

            invoice.addPayment(invoicePayment);
        });

        // Adicionar splits
        request.splits?.forEach((split) => {
            const invoiceSplit = InvoiceSplit.create({
                invoiceId: invoice.id,
                recipientId: new UniqueEntityID(split.recipientId),
                splitType: split.splitType,
                amount: split.amount,
                feeAmount: split.feeAmount
            });

            invoice.addSplit(invoiceSplit);
        });

        // Adicionar anexos
        request.attachments?.forEach((attachment) => {
            const invoiceAttachment = InvoiceAttachment.create({
                invoiceId: invoice.id,
                fileId: new UniqueEntityID(attachment.fileId)
            });

            invoice.addAttachment(invoiceAttachment);
        });

        return invoice;
    }
}