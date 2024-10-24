import { Injectable } from '@nestjs/common';
import { PaymentsProvider } from '@/domain/interfaces/payments-provider';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';
import { PaymentRepository } from '@/domain/payment/repositories/payment-repository';
import { Either, left, right } from '@/core/either';

interface CancelScheduledPixPaymentUseCaseRequest {
    paymentId: string;
    businessId: string;
}

export interface CancelScheduledPixPaymentUseCaseResponse {
    message: string;
}

type CancelScheduledPixPaymentResult = Either<AppError, CancelScheduledPixPaymentUseCaseResponse>;

@Injectable()
export class CancelPaymentPixScheduledUseCase {
    constructor(
        private paymentProvider: PaymentsProvider,
        private paymentRepository: PaymentRepository,
        private i18nService: I18nService,
    ) { }

    async execute(
        input: CancelScheduledPixPaymentUseCaseRequest,
        language: Language = 'en-US'
    ): Promise<CancelScheduledPixPaymentResult> {
        try {
            const existingPayment = await this.paymentRepository.findById(input.paymentId, input.businessId);

            if (!existingPayment) {
                const errorMessage = this.i18nService.translate('errors.RESOURCE_NOT_FOUND', language);
                return left(AppError.resourceNotFound(errorMessage));
            }

            if (!existingPayment.paymentId) {
                const errorMessage = this.i18nService.translate('errors.RESOURCE_NOT_FOUND', language);
                return left(AppError.resourceNotFound(errorMessage));
            }

            if (existingPayment.status !== 'SCHEDULED') {
                const errorMessage = this.i18nService.translate('errors.INVALID_OPERATION', language);
                return left(AppError.invalidOperation(errorMessage));
            }

            await this.paymentProvider.cancelarPixAgendado({
                idTransacao: existingPayment.paymentId
            });

            existingPayment.status = 'CANCELLED';
            await this.paymentRepository.save(existingPayment);

            const successMessage = this.i18nService.translate('messages.PIX_PAYMENT_CANCELLED', language);

            return right({ message: successMessage });

        } catch (error) {
            const errorMessage = this.i18nService.translate('errors.PIX_PAYMENT_CANCELLATION_FAILED', language, {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return left(AppError.paymentPixCancelationFailed());
        }
    }
}