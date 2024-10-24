import { right, left, Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PaymentsProvider } from '../../interfaces/payments-provider';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';
import { Payment, PaymentType } from '@/domain/payment/entities/payment';
import { PaymentRepository } from '@/domain/payment/repositories/payment-repository';
import { randomUUID } from 'crypto';

interface CreatePixPaymentBankDataUseCaseRequest {
    businessId: string;
    personId?: string;
    documento: string;
    agenciaBeneficiario: string;
    ispbBeneficiario: string;
    contaBeneficiario: string;
    tipoContaBeneficiario: 'CORRENTE' | 'PAGAMENTO' | 'SALARIO' | 'POUPANCA';
    nomeBeneficiario: string;
    documentoBeneficiario: string;
    dataPagamento: string;
    valorPagamento: number;
    mensagemPix?: string;
}

export interface CreatePixPaymentBankDataUseCaseResponse {
    payment: Payment;
    message: string;
}

type CreatePixPaymentBankDataResult = Either<AppError, CreatePixPaymentBankDataUseCaseResponse>;

@Injectable()
export class CreatePaymentPixBankDataUseCase {
    constructor(
        private paymentProvider: PaymentsProvider,
        private paymentRepository: PaymentRepository,
        private i18nService: I18nService,
    ) { }

    async execute(
        input: CreatePixPaymentBankDataUseCaseRequest,
        language: Language = 'en-US'
    ): Promise<CreatePixPaymentBankDataResult> {
        try {
            const paymentResponse = await this.paymentProvider.criarPixComDadosBancarios({
                ...input,
                identificadorPagamentoAssociado: randomUUID(),
                idTransacao: randomUUID()
            });

            const payment = this.createPaymentFromResponse(input, paymentResponse);

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

    private createPaymentFromResponse(input: CreatePixPaymentBankDataUseCaseRequest, paymentResponse: any): Payment {
        if (!paymentResponse) {
            throw new Error(this.i18nService.translate('errors.PIX_PAYMENT_CREATION_FAILED'));
        }

        return Payment.create({
            businessId: new UniqueEntityID(input.businessId),
            ...(input.personId ? { personId: new UniqueEntityID(input.personId) } : {}),
            status: 'PAID',
            createdAt: new Date(),
            paymentId: paymentResponse.idPagamentoPix || null,
            pixMessage: paymentResponse.mensagemPix || null,
            paymentType: PaymentType.PIX_BANK_DATA,
            amount: input.valorPagamento,
            feeAmount: 0,
            paymentDate: new Date(input.dataPagamento),

            beneficiaryBranch: input.agenciaBeneficiario,
            beneficiaryIspb: input.ispbBeneficiario,
            beneficiaryAccount: input.contaBeneficiario,
            beneficiaryAccountType: input.tipoContaBeneficiario,
            beneficiaryName: input.nomeBeneficiario,
            beneficiaryDocument: input.documentoBeneficiario,

        });
    }

    private isValidBankData(bankData: any): boolean {
        // Implement validation logic for bank data
        // This is a placeholder and should be replaced with actual validation rules
        return (
            !!bankData.agenciaBeneficiario &&
            !!bankData.ispbBeneficiario &&
            !!bankData.contaBeneficiario &&
            !!bankData.tipoContaBeneficiario &&
            !!bankData.nomeBeneficiario &&
            !!bankData.documentoBeneficiario
        );
    }
}