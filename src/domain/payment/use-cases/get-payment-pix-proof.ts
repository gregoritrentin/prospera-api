import { Injectable } from '@nestjs/common';
import { PaymentsProvider } from '../../interfaces/payments-provider';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';
import { PaymentRepository } from '@/domain/payment/repositories/payment-repository';
import { Either, left, right } from '@/core/either';

interface ProofPixPaymentUseCaseRequest {
    paymentId: string;
    businessId: string;
}

export interface ProofPixPaymentUseCaseResponse {
    proofPdf: Buffer;
    message: string;
}

type ProofPixPaymentResult = Either<AppError, ProofPixPaymentUseCaseResponse>;

@Injectable()
export class GetPaymentPixProofUseCase {
    constructor(
        private paymentProvider: PaymentsProvider,
        private paymentRepository: PaymentRepository,
        private i18nService: I18nService,
    ) { }

    async execute(
        input: ProofPixPaymentUseCaseRequest,
        language: Language = 'en-US'
    ): Promise<ProofPixPaymentResult> {
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

            const proofPdf = await this.paymentProvider.buscarComprovantePix({
                idTransacao: existingPayment.paymentId
            });

            const successMessage = this.i18nService.translate('messages.PIX_PAYMENT_PROOF_FETCHED', language);

            return right({ proofPdf, message: successMessage });

        } catch (error) {
            const errorMessage = this.i18nService.translate('errors.PIX_PAYMENT_PROOF_FETCH_FAILED', language, {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return left(AppError.paymentPixProofFailed());
        }
    }
}