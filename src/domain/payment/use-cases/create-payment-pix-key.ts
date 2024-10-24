import { right, left, Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PaymentsProvider } from '../../interfaces/payments-provider';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';
import { Payment, PaymentType } from '@/domain/payment/entities/payment';
import { PaymentRepository } from '@/domain/payment/repositories/payment-repository';
import { randomUUID } from 'crypto';

interface CreatePixPaymentUseCaseRequest {
    businessId: string;
    personId?: string;
    keyValue: string;
    documento: string;
    chavePix: string;
    documentoBeneficiario: string;
    dataPagamento: string;
    valorPagamento: number;
    mensagemPix?: string;

}

export interface CreatePixPaymentUseCaseResponse {
    payment: Payment;
    message: string;
}

type CreatePixPaymentResult = Either<AppError, CreatePixPaymentUseCaseResponse>;

@Injectable()
export class CreatePaymentPixKeyUseCase {
    constructor(
        private paymentProvider: PaymentsProvider,
        private paymentRepository: PaymentRepository,
        private i18nService: I18nService,
    ) { }

    async execute(
        input: CreatePixPaymentUseCaseRequest,
        language: Language = 'en-US'
    ): Promise<CreatePixPaymentResult> {
        try {

            const paymentResponse = await this.paymentProvider.criarPixComChave({
                ...input,
                identificadorPagamentoAssociado: randomUUID(),
                idTransacao: randomUUID()
            });

            const payment = this.createPaymentFromResponse(input, paymentResponse);

            console.log(payment)

            await this.paymentRepository.create(payment);

            const successMessage = this.i18nService.translate('messages.PIX_PAYMENT_CREATED', language);

            return right({ payment, message: successMessage });

        } catch (error) {
            const errorMessage = this.i18nService.translate('errors.PIX_PAYMENT_CREATION_FAILED', language, {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return left(AppError.pixCreationFailed());
        }
    }

    private createPaymentFromResponse(input: CreatePixPaymentUseCaseRequest, paymentResponse: any): Payment {
        if (!paymentResponse) {
            throw new Error(this.i18nService.translate('errors.PIX_PAYMENT_CREATION_FAILED'));
        }

        return Payment.create({
            businessId: new UniqueEntityID(input.businessId),
            ...(input.personId ? { personId: new UniqueEntityID(input.personId) } : {}),
            pixKey: input.keyValue,
            status: 'PAID',
            createdAt: new Date(),
            paymentId: paymentResponse.idPagamentoPix || null,
            pixMessage: paymentResponse.mensagemPix || null,
            paymentType: PaymentType.PIX_KEY,
            amount: input.valorPagamento,
            feeAmount: 0,
            paymentDate: new Date(input.dataPagamento),
        });
    }

    private isValidPixKey(keyType: string, keyValue: string): boolean {
        switch (keyType) {
            case 'CPF':
                return /^\d{11}$/.test(keyValue);
            case 'CNPJ':
                return /^\d{14}$/.test(keyValue);
            case 'EMAIL':
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(keyValue);
            case 'PHONE':
                return /^\+55\d{10,11}$/.test(keyValue);
            case 'EVP':
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(keyValue);
            default:
                return false;
        }
    }
}