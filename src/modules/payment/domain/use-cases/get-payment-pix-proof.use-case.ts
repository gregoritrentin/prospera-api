import { Injectable } from '@nestjs/common'
import { PaymentsProvider } from '@/modules/payment/infra/provider/payments-provider'
import { PaymentRepository } from '@/modules/payme/domain/repositori/payment-repository'

import { I18nService, Language } from @core/i1@core/i18n.service';
import { AppError } from @core/co@core/erro@core/app-errors';
import { Either, left, right } from @core/co@core/either';

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