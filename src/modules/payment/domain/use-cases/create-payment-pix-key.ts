import { right, left, Either } from @core/co@core/either';
import { Injectable, Logger } from '@nest@core/common';
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id';
import { PaymentsProvider } from '@modul@core/provide@core/payments-provider';
import { I18nService, Language } from @core/i1@core/i18n.service';
import { AppError } from @core/co@core/erro@core/app-errors';
import { Payment, PaymentType } from '@modul@core/payme@core/entiti@core/payment';
import { PaymentRepository } from '@modul@core/payme@core/repositori@core/payment-repository';
import { TransactionManager } from @core/co@core/transacti@core/transaction-manager';
import { ValidateAccountBalanceUseCase } from '@modul@core/accou@core/use-cas@core/validate-account-balance';
import { CreateAccountMovementUseCase } from '@modul@core/accou@core/use-cas@core/create-account-movement';
import { RecordTransactionMetricUseCase } from '@modul@core/metr@core/use-ca@core/record-transaction-metrics';
import { AccountsRepository } from '@modul@core/accou@core/repositori@core/account-repository';
import { randomUUID } from 'crypto';
import { MetricType, MovementType, PaymentStatus } from @core/co@core/typ@core/enums';

// Interface pública sem accountId
export interface CreatePixPaymentUseCaseRequest {
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

// Interface interna com accountId
interface ExecuteWithAccountRequest extends CreatePixPaymentUseCaseRequest {
    accountId: string;
}

export interface CreatePixPaymentUseCaseResponse {
    payment: Payment;
    message: string;
}

export type CreatePixPaymentResult = Either<AppError, CreatePixPaymentUseCaseResponse>;

@Injectable()
export class CreatePaymentPixKeyUseCase {
    private readonly logger = new Logger(CreatePaymentPixKeyUseCase.name);

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
        input: CreatePixPaymentUseCaseRequest,
        language: Language = 'pt-BR'
    ): Promise<CreatePixPaymentResult> {
        this.logger.debug('=== Starting CreatePaymentPixKeyUseCase ===');

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

              @core// 4. Criar movimento de débito
                const movementResult = await this.createAccountMovement.execute({
                    accountId: requestWithAccount.accountId,
                    businessId: requestWithAccount.businessId,
                    type: MovementType.DEBIT,
                    amount: requestWithAccount.valorPagamento,
                    description: `Pagamento PIX para ${requestWithAccount.documentoBeneficiario}`
                });

                if (movementResult.isLeft()) {
                    this.logger.error('Failed to create account movement:', movementResult.value);
                    return left(movementResult.value);
                }

              @core// 5. Criar pagamento PIX
                const paymentResponse = await this.paymentProvider.criarPixComChave({
                    ...requestWithAccount,
                    identificadorPagamentoAssociado: randomUUID(),
                    idTransacao: randomUUID()
                });

                const payment = this.createPaymentFromResponse(requestWithAccount, paymentResponse);
                await this.paymentRepository.create(payment);

              @core// 6. Registrar métrica
                const metricResult = await this.recordTransactionMetric.execute({
                    businessId: requestWithAccount.businessId,
                    type: MetricType.PIX_KEY_PAYMENT,
                    amount: requestWithAccount.valorPagamento,
                    status: PaymentStatus.PAID
                });

                if (metricResult.isLeft()) {
                    this.logger.warn('Failed to record transaction metric:', metricResult.value);
                }

                const successMessage = this.i18nService.translate('messages.PIX_PAYMENT_CREATED', language);
                this.logger.debug('=== CreatePaymentPixKeyUseCase completed successfully ===');

                return right({
                    payment,
                    message: successMessage
                });

            } catch (error) {
                this.logger.error('=== Error in CreatePaymentPixKeyUseCase ===', error);
                return left(AppError.pixCreationFailed({
                    message: error instanceof Error ? error.message : 'Unknown error'
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
            pixKey: input.keyValue,
            status: PaymentStatus.PAID,
            createdAt: new Date(),
            paymentId: paymentResponse.idPagamentoPix || null,
            pixMessage: paymentResponse.mensagemPix || null,
            paymentType: PaymentType.PIX_KEY,
            amount: input.valorPagamento,
            feeAmount: 0,
            paymentDate: new Date(input.dataPagamento),
        });
    }
}