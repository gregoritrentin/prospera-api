import { right, left, Either } from '@/core/either';
import { Injectable, Logger } from '@nestjs/common';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PaymentsProvider } from '@/domain/providers/payments-provider';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';
import { Payment, PaymentType } from '@/domain/payment/entities/payment';
import { PaymentRepository } from '@/domain/payment/repositories/payment-repository';
import { TransactionManager } from '@/core/transaction/transaction-manager';
import { ValidateAccountBalanceUseCase } from '@/domain/account/use-cases/validate-account-balance';
import { CreateAccountMovementUseCase } from '@/domain/account/use-cases/create-account-movement';
import { RecordTransactionMetricUseCase } from '@/domain/metric/use-case/record-transaction-metrics';
import { AccountsRepository } from '@/domain/account/repositories/account-repository';
import { randomUUID } from 'crypto';
import { MetricType, MovementType, PaymentStatus } from '@/core/types/enums';

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
                // 1. Buscar conta do negócio
                const account = await this.accountRepository.findByBusinessId(input.businessId);

                if (!account) {
                    this.logger.debug('Account not found for business:', input.businessId);
                    return left(AppError.resourceNotFound('errors.ACCOUNT_NOT_FOUND'));
                }

                // 2. Criar o request completo com o accountId
                const requestWithAccount: ExecuteWithAccountRequest = {
                    ...input,
                    accountId: account.id.toString()
                };

                // 3. Validar saldo disponível
                const balanceValidation = await this.validateAccountBalance.execute({
                    accountId: requestWithAccount.accountId,
                    amount: requestWithAccount.valorPagamento
                });

                if (!balanceValidation.isValid) {
                    this.logger.debug('Balance validation failed:', balanceValidation.reason);
                    return left(AppError.invalidOperation(balanceValidation.reason || 'Invalid balance'));
                }

                // 4. Criar movimento de débito
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

                // 5. Criar pagamento PIX
                const paymentResponse = await this.paymentProvider.criarPixComChave({
                    ...requestWithAccount,
                    identificadorPagamentoAssociado: randomUUID(),
                    idTransacao: randomUUID()
                });

                const payment = this.createPaymentFromResponse(requestWithAccount, paymentResponse);
                await this.paymentRepository.create(payment);

                // 6. Registrar métrica
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