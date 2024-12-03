import { Injectable, Inject } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';
import { CalculationMode, InvoiceStatus, YesNo, PaymentMethod } from '@/core/types/enums';
import { QueueProvider } from '@/domain/interfaces/queue-provider';

interface InvoiceItemRequest {
    itemId: string;
    itemDescription: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    totalPrice: number;
}

interface InvoiceSplitRequest {
    recipientId: string;
    splitType: CalculationMode;
    amount: number;
    feeAmount: number;
}

interface InvoiceTransactionRequest {
    transactionId: string;
}

interface InvoiceAttachmentRequest {
    fileId: string;
}

interface InvoicePaymentRequest {
    dueDate: Date;
    amount: number;
    paymentMethod: PaymentMethod;
}

export interface CreateInvoiceUseCaseRequest {
    businessId: string;
    personId: string;
    description?: string | null;
    notes?: string | null;
    paymentLink: string;
    status: InvoiceStatus;
    issueDate: Date;
    dueDate: Date;
    paymentDate: Date;
    paymentLimitDate?: Date | null;
    grossAmount: number;
    discountAmount: number;
    amount: number;
    paymentAmount: number;
    protestMode: YesNo;
    protestDays: number;
    lateMode: CalculationMode;
    lateValue: number;
    interestMode: CalculationMode;
    interestDays: number;
    interestValue: number;
    discountMode: CalculationMode;
    discountDays: number;
    discountValue: number;

    items: InvoiceItemRequest[];
    splits?: InvoiceSplitRequest[];
    transactions?: InvoiceTransactionRequest[];
    attachments?: InvoiceAttachmentRequest[];
    payments?: InvoicePaymentRequest[];
}

type CreateInvoiceUseCaseResponse = Either<
    AppError,
    {
        jobId: string;
        message: string;
    }
>;

@Injectable()
export class CreateInvoiceUseCase {
    constructor(
        private i18nService: I18nService,
        @Inject(QueueProvider)
        private queueService: QueueProvider
    ) { }

    async execute(
        request: CreateInvoiceUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<CreateInvoiceUseCaseResponse> {
        try {
            const validationResult = this.validateInvoice(request);
            if (validationResult !== true) {
                return left(validationResult);
            }

            try {
                // Enfileira o job de criação da invoice
                const result = await this.queueService.addJob(
                    'invoice',
                    'create-invoice',
                    {
                        request,
                        language
                    }
                );

                return right({
                    jobId: result.jobId,
                    message: this.i18nService.translate('messages.INVOICE_CREATION_QUEUED', language)
                });
            } catch (error) {
                return left(
                    AppError.internalServerError(
                        this.i18nService.translate('errors.FAILED_TO_QUEUE_INVOICE', language)
                    )
                );
            }
        } catch (error) {
            const errorMessage = this.i18nService.translate('errors.INVOICE_CREATION_ERROR', language, {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return left(AppError.internalServerError(errorMessage));
        }
    }

    private validateInvoice(request: CreateInvoiceUseCaseRequest): true | AppError {
        // Validação das datas
        const issueDate = new Date(request.issueDate);
        issueDate.setHours(0, 0, 0, 0);

        const dueDate = new Date(request.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate.getTime() < issueDate.getTime()) {
            return AppError.invalidDueDate();
        }

        if (request.paymentLimitDate) {
            const limitDate = new Date(request.paymentLimitDate);
            limitDate.setHours(0, 0, 0, 0);

            if (limitDate.getTime() < dueDate.getTime()) {
                return AppError.invalidLimitData('errors.INVALID_LIMIT_DATE');
            }
        }

        // Validação dos itens
        if (!request.items?.length) {
            return AppError.noItems('errors.NO_ITEMS');
        }

        return true

        // Validação dos valores monetários
        // const calculatedAmount = request.grossAmount - request.discountAmount;
        // if (Math.abs(calculatedAmount - request.amount) > 0.01) {
        //     return AppError.validationError('errors.AMOUNT_MISMATCH');
        // }

        // Validação dos totais dos itens
        // const itemsTotal = request.items.reduce((sum, item) => sum + item.totalPrice, 0);
        // if (Math.abs(itemsTotal - request.grossAmount) > 0.01) {
        //     return AppError.validationError('errors.ITEMS_TOTAL_MISMATCH');
        // }

        // Validação dos payments
        // if (request.payments?.length) {
        //     const paymentsTotal = request.payments.reduce((sum, payment) => sum + payment.amount, 0);
        //     if (Math.abs(paymentsTotal - request.amount) > 0.01) {
        //         return AppError.validationError('errors.PAYMENTS_TOTAL_MISMATCH');
        //     }
        // }

        // Validação dos splits se existirem
        // if (request.splits?.length) {
        //     const splitsTotal = request.splits.reduce((sum, split) => sum + split.amount, 0);
        //     if (Math.abs(splitsTotal - request.amount) > 0.01) {
        //         return AppError.validationError('errors.SPLITS_TOTAL_MISMATCH');
        //     }

        // Validar valores das comissões
        // const validSplitTypes = [CalculationMode.NONE, CalculationMode.PERCENT, CalculationMode.VALUE];
        // const invalidSplit = request.splits.find(split => !validSplitTypes.includes(split.splitType));
        // if (invalidSplit) {
        //     return AppError.validationError('errors.INVALID_SPLIT_TYPE');
        // }

        // Validar percentuais se for do tipo PERCENT
        // const percentSplits = request.splits.filter(split => split.splitType === CalculationMode.PERCENT);
        // if (percentSplits.length) {
        //     const totalPercent = percentSplits.reduce((sum, split) => sum + split.amount, 0);
        //     if (totalPercent > 100) {
        //         return AppError.validationError('errors.SPLIT_PERCENT_EXCEEDS_100');
        //     }
    }
}

// Validação dos modos de cálculo
//const validCalculationModes = [CalculationMode.NONE, CalculationMode.PERCENT, CalculationMode.VALUE];

// if (!validCalculationModes.includes(request.lateMode)) {
//     return AppError.validationError('errors.INVALID_LATE_MODE');
// }

// if (!validCalculationModes.includes(request.interestMode)) {
//     return AppError.validationError('errors.INVALID_INTEREST_MODE');
// }

// if (!validCalculationModes.includes(request.discountMode)) {
//     return AppError.validationError('errors.INVALID_DISCOUNT_MODE');
// }

// // Validação dos valores de acordo com o modo
// if (request.lateMode !== CalculationMode.NONE && request.lateValue <= 0) {
//     return AppError.validationError('errors.INVALID_LATE_VALUE');
// }

// if (request.interestMode !== CalculationMode.NONE && request.interestValue <= 0) {
//     return AppError.validationError('errors.INVALID_INTEREST_VALUE');
// }

// if (request.discountMode !== CalculationMode.NONE && request.discountValue <= 0) {
//     return AppError.validationError('errors.INVALID_DISCOUNT_VALUE');
// }

// return true;
//     }
// }