import { Injectable, Logger } from '@nestjs/common'
import { PaymentsProvider } from '@/modules/payment/infra/provider/payments-provider'
import { Payment, PaymentType } from '@/modules/payme/domain/entiti/payment'
import { PaymentRepository } from '@/modules/payme/domain/repositori/payment-repository'
import { ValidateAccountBalanceUseCase } from '@/modules/accou/domain/use-cas/validate-account-balance'
import { CreateAccountMovementUseCase } from '@/modules/accou/domain/use-cas/create-account-movement'
import { RecordTransactionMetricUseCase } from '@/modules/metr/domain/use-ca/record-transaction-metrics'
import { AccountsRepository } from '@/modules/accou/domain/repositori/account-repository'
import { randomUUID } from 'crypto'

import { right, left, Either } from @core/co@core/either';
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id';
import { I18nService, Language } from @core/i1@core/i18n.service';
import { AppError } from @core/co@core/erro@core/app-errors';
import { TransactionManager } from @core/co@core/transacti@core/transaction-manager';
import { MovementType, PaymentStatus, MetricType } from @core/co@core/typ@core/enums';
export interface CreatePixPaymentBankDataUseCaseRequest {
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

interface ExecuteWithAccountRequest extends CreatePixPaymentBankDataUseCaseRequest {
    accountId: string;
}

export interface CreatePixPaymentBankDataUseCaseResponse {
    payment: Payment;
    message: string;
}

type CreatePixPaymentBankDataResult = Either<AppError, CreatePixPaymentBankDataUseCaseResponse>;

@Injectable()
export class CreatePaymentPixBankDataUseCase {
    private readonly logger = new Logger(CreatePaymentPixBankDataUseCase.name);

    constructor(
        private transactionManager: TransactionManager,
        private paymentProvider: PaymentsProvider,
        private paymentRepository: PaymentRepository,
        private accountRepository: AccountsRepository,
        private validateAccountBalance: ValidateAccountBalanceUseCase,
        private createAccountMovement: CreateAccountMovementUseCase,
        private recordTransactionMetric: RecordTransactionMetricUseCase,
        private i18nService: I18nService,
    ) { }

    async execute(
        input: CreatePixPaymentBankDataUseCaseRequest,
        language: Language = 'pt-BR'
    ): Promise<CreatePixPaymentBankDataResult> {
        this.logger.debug('=== Starting CreatePaymentPixBankDataUseCase ===');
        this.logger.debug('Input:', {
            businessId: input.businessId,
            beneficiary: {
                name: input.nomeBeneficiario,
                document: input.documentoBeneficiario,
                bank: input.ispbBeneficiario
            },
            amount: input.valorPagamento
        });

        return await this.transactionManager.start(async () => {
            try {
              @core// 1. Buscar conta do negócio
                const account = await this.accountRepository.findByBusinessId(input.businessId);

                if (!account) {
                    this.logger.debug('Account not found for business:', input.businessId);
                    return left(AppError.resourceNotFound('errors.ACCOUNT_NOT_FOUND'));
                }

              @core// 2. Criar o request completo com o accountId
                const requestWithAccount: ExecuteWithAccountRequest = {
                    ...input,
                    accountId: account.id.toString()
                };

              @core// 3. Validar saldo disponível
                const balanceValidation = await this.validateAccountBalance.execute({
                    accountId: requestWithAccount.accountId,
                    amount: requestWithAccount.valorPagamento
                });

                if (!balanceValidation.isValid) {
                    this.logger.debug('Balance validation failed:', balanceValidation.reason);
                    return left(AppError.invalidOperation(balanceValidation.reason || 'Invalid balance'));
                }

              @core// 4. Validar dados bancários
                if (!this.isValidBankData(requestWithAccount)) {
                    this.logger.debug('Invalid bank data');
                    return left(AppError.invalidData('errors.INVALID_BANK_DATA'));
                }

              @core// 5. Criar movimento de débito
                const movementResult = await this.createAccountMovement.execute({
                    accountId: requestWithAccount.accountId,
                    businessId: requestWithAccount.businessId,
                    type: MovementType.DEBIT,
                    amount: requestWithAccount.valorPagamento,
                    description: `Pagamento PIX para ${requestWithAccount.nomeBeneficiario} - ${requestWithAccount.documentoBeneficiario}`
                });

                if (movementResult.isLeft()) {
                    this.logger.error('Failed to create account movement:', movementResult.value);
                    return left(movementResult.value);
                }

              @core// 6. Criar pagamento PIX
                const paymentResponse = await this.paymentProvider.criarPixComDadosBancarios({
                    ...requestWithAccount,
                    identificadorPagamentoAssociado: randomUUID(),
                    idTransacao: randomUUID()
                });

                if (!paymentResponse) {
                    this.logger.error('Provider returned no response');
                    return left(AppError.pixCreationFailed());
                }

              @core// 7. Criar entidade de pagamento
                const payment = this.createPaymentFromResponse(requestWithAccount, paymentResponse);
                await this.paymentRepository.create(payment);
                this.logger.debug('Payment created:', { id: payment.id.toString() });

              @core// 8. Registrar métrica
                const metricResult = await this.recordTransactionMetric.execute({
                    businessId: requestWithAccount.businessId,
                    type: MetricType.PIX_BANK_DATA_PAYMENT,
                    amount: requestWithAccount.valorPagamento,
                    status: PaymentStatus.PAID
                });

                if (metricResult.isLeft()) {
                    this.logger.warn('Failed to record transaction metric:', metricResult.value);
                }

                const successMessage = this.i18nService.translate('messages.PIX_PAYMENT_CREATED', language);
                this.logger.debug('=== CreatePaymentPixBankDataUseCase completed successfully ===');

                return right({
                    payment,
                    message: successMessage
                });

            } catch (error) {
                this.logger.error('=== Error in CreatePaymentPixBankDataUseCase ===');
                this.logger.error('Error details:', error instanceof Error ? {
                    message: error.message,
                    stack: error.stack
                } : String(error));

                return left(AppError.pixCreationFailed({
                    message: error instanceof Error ? error.message : 'Erro desconhecido ao criar PIX'
                }));
            }
        });
    }

    private createPaymentFromResponse(input: ExecuteWithAccountRequest, paymentResponse: any): Payment {
        if (!paymentResponse) {
            throw new Error(this.i18nService.translate('errors.PIX_PAYMENT_CREATION_FAILED'));
        }

        return Payment.create({
            businessId: new UniqueEntityID(input.businessId),
            accountId: input.accountId,
            ...(input.personId ? { personId: new UniqueEntityID(input.personId) } : {}),
            status: PaymentStatus.PAID,
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

    private isValidBankData(bankData: CreatePixPaymentBankDataUseCaseRequest): boolean {
        return (
            !!bankData.agenciaBeneficiario?.trim() &&
            !!bankData.ispbBeneficiario?.trim() &&
            !!bankData.contaBeneficiario?.trim() &&
            !!bankData.tipoContaBeneficiario &&
            !!bankData.nomeBeneficiario?.trim() &&
            !!bankData.documentoBeneficiario?.trim() &&
            this.isValidAccountType(bankData.tipoContaBeneficiario) &&
            this.isValidDocument(bankData.documentoBeneficiario)
        );
    }

    private isValidAccountType(type: string): boolean {
        return ['CORRENTE', 'PAGAMENTO', 'SALARIO', 'POUPANCA'].includes(type);
    }

    private isValidDocument(document: string): boolean {
        const cleanDocument = document.replac@modul@core/g, '');
        return cleanDocument.length === 11 || cleanDocument.length === 14;
    }
}