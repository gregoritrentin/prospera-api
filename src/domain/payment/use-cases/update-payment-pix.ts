import { right, left, Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PaymentsProvider } from '../../interfaces/payments-provider';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';
import { Payment, PaymentType } from '@/domain/payment/entities/payment';
import { PaymentRepository } from '@/domain/payment/repositories/payment-repository';

interface UpdatePixPaymentUseCaseRequest {
    paymentId: string;
    businessId: string;
}

export interface UpdatePixPaymentUseCaseResponse {
    payment: Payment;
    message: string;
}

type UpdatePixPaymentResult = Either<AppError, UpdatePixPaymentUseCaseResponse>;

@Injectable()
export class UpdatePaymentPixUseCase {
    constructor(
        private paymentProvider: PaymentsProvider,
        private paymentRepository: PaymentRepository,
        private i18nService: I18nService,
    ) { }

    async execute(
        input: UpdatePixPaymentUseCaseRequest,
        language: Language = 'en-US'
    ): Promise<UpdatePixPaymentResult> {
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

            const updatedPaymentData = await this.paymentProvider.buscarPixPorIdTransacao({
                idTransacao: existingPayment.paymentId
            });

            if (!updatedPaymentData) {
                const errorMessage = this.i18nService.translate('errors.RESOURCE_NOT_FOUND', language);
                return left(AppError.resourceNotFound(errorMessage));
            }

            const updatedPayment = this.updatePaymentFromResponse(existingPayment, updatedPaymentData);

            await this.paymentRepository.save(updatedPayment);

            const successMessage = this.i18nService.translate('messages.PIX_PAYMENT_UPDATED', language);

            return right({ payment: updatedPayment, message: successMessage });

        } catch (error) {
            const errorMessage = this.i18nService.translate('errors.PIX_PAYMENT_UPDATE_FAILED', language, {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return left(AppError.paymentPixUpdateFailed());
        }
    }

    private updatePaymentFromResponse(existingPayment: Payment, updatedData: any): Payment {
        if (!updatedData) {
            throw new Error(this.i18nService.translate('errors.PIX_PAYMENT_UPDATE_FAILED'));
        }

        const updatedProps = {
            businessId: existingPayment.businessId,
            personId: existingPayment.personId,
            paymentType: existingPayment.paymentType,
            status: this.mapStatus(updatedData.status),
            paymentId: updatedData.idPagamentoPix || existingPayment.paymentId,
            amount: updatedData.valorPagamento || existingPayment.amount,
            feeAmount: existingPayment.feeAmount,
            paymentDate: new Date(updatedData.dataPagamento) || existingPayment.paymentDate,
            createdAt: existingPayment.createdAt,
            updatedAt: new Date(),
        };

        return Payment.create(updatedProps, new UniqueEntityID(existingPayment.id.toString()));
    }

    private mapStatus(sicrediStatus: string): string {
        switch (sicrediStatus) {
            case 'SUCESSO':
                return 'PAID';
            case 'AGENDADO':
                return 'SCHEDULED';
            case 'CANCELADO':
                return 'CANCELLED';
            default:
                return 'PENDING';
        }
    }
}