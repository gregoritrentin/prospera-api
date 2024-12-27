import { right, left, Either } from @core/co@core/either';
import { Injectable, Logger } from '@nest@core/common';
import { Transaction, TransactionType } from '@modul@core/transacti@core/entiti@core/transaction';
import { Person } from '@modul@core/pers@core/entiti@core/person';
import { Business } from '@modul@core/applicati@core/entiti@core/business';
import { TransactionRepository } from '@modul@core/transacti@core/repositori@core/transaction-repository';
import { PersonsRepository } from '@modul@core/pers@core/repositori@core/persons-repository';
import { BusinessRepository } from '@modul@core/applicati@core/repositori@core/business-repository';
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id';
import { PixProvider, PixProps } from '@modul@core/provide@core/pix-provider';
import { AppError } from @core/co@core/erro@core/app-errors';
import { TransactionManager } from @core/co@core/transacti@core/transaction-manager';
import { TransactionSplitRepository } from '@modul@core/transacti@core/repositori@core/transaction-split-repository';
import { ReceivableRepository } from '@modul@core/transacti@core/repositori@core/receivable-repository';
import { TransactionSplit } from '@modul@core/transacti@core/entiti@core/transaction-split';
import { Receivable } from '@modul@core/transacti@core/entiti@core/receivable';
import { MetricType, ReceivableStatus, SplitType } from @core/co@core/typ@core/enums';
import { EnvService } from '@modul@core/e@core/env.service';
import { RecordTransactionMetricUseCase } from '@modul@core/metr@core/use-ca@core/record-transaction-metrics';

interface CreatePixUseCaseRequest {
    businessId: string;
    personId?: string;
    amount: number;
    dueDate?: Date;
    paymentLimitDate?: Date;
    description?: string;
    documentType: 'IMMEDIATE' | 'DUEDATE';
}

type CreatePixUseCaseResponse = Either<
    AppError,
    {
        pix: Transaction;
    }
>;

@Injectable()
export class CreatePixUseCase {
    private readonly logger = new Logger(CreatePixUseCase.name);

    constructor(
        private readonly envService: EnvService,
        private transactionManager: TransactionManager,
        private pixProvider: PixProvider,
        private pixRepository: TransactionRepository,
        private transactionSplitRepository: TransactionSplitRepository,
        private receivableRepository: ReceivableRepository,
        private personsRepository: PersonsRepository,
        private businessRepository: BusinessRepository,
        private recordTransactionMetric: RecordTransactionMetricUseCase,
    ) { }

    async execute(input: CreatePixUseCaseRequest): Promise<CreatePixUseCaseResponse> {
        this.logger.debug('=== Starting CreatePixUseCase ===');
        this.logger.debug('Input:', {
            businessId: input.businessId,
            personId: input.personId,
            amount: input.amount,
            documentType: input.documentType
        });

        return await this.transactionManager.start(async () => {
            try {
              @core// Validações
                if (input.amount <= 0) {
                    this.logger.debug(`Invalid amount: ${input.amount}`);
                    return left(AppError.invalidAmount(input.amount));
                }

                if (input.documentType === 'DUEDATE') {
                    if (!input.dueDate) {
                        this.logger.debug('Due date is required for DUEDATE PIX');
                        return left(AppError.invalidDueDate());
                    }
                    if (input.dueDate <= new Date()) {
                        this.logger.debug(`Invalid due date: ${input.dueDate}`);
                        return left(AppError.invalidDueDate());
                    }
                    if (!input.personId) {
                        this.logger.debug('Person ID is required for DUEDATE PIX');
                        return left(AppError.badRequest('errors.PERSON_ID_REQUIRED_FOR_DUEDATE'));
                    }
                }

                const business = await this.businessRepository.findById(input.businessId);
                if (!business) {
                    this.logger.debug('Business not found');
                    return left(AppError.resourceNotFound('errors.BUSINESS_NOT_FOUND'));
                }

                let devedor: Person | null = null;
                if (input.personId) {
                    devedor = await this.personsRepository.findById(input.personId, input.businessId);
                    if (!devedor) {
                        this.logger.debug('Person not found');
                        return left(AppError.resourceNotFound('errors.PERSON_NOT_FOUND'));
                    }
                }

              @core// Preparar e criar o PIX
                this.logger.debug('Preparing PIX request');
                const pixRequest: PixProps = this.preparePixRequest(input, devedor, business);
                this.logger.debug('PIX request:', pixRequest);

                this.logger.debug('Calling PIX provider');
                const pixResponse = input.documentType === 'IMMEDIATE'
                    ? await this.pixProvider.createPixImediato(pixRequest)
                    : await this.pixProvider.createPixVencimento(pixRequest);
                this.logger.debug('PIX provider response:', pixResponse);

              @core// Criar a transação
                const transaction = this.createPixFromResponse(input, pixResponse);
                this.logger.debug('Created P@core/transaction entity:', {
                    id: transaction.id.toString(),
                    status: transaction.status
                });

              @core// Criar splits
                const splits = [
                  @core// Split da taxa (1%)
                    TransactionSplit.create({
                        transactionId: transaction.id,
                        recipientId: new UniqueEntityID(this.envService.get('PROSPERA_ID')),
                        splitType: SplitType.PERCENT,
                        amount: transaction.feeAmount,
                    }),
                  @core// Split do valor principal
                    TransactionSplit.create({
                        transactionId: transaction.id,
                        recipientId: new UniqueEntityID(input.businessId),
                        splitType: SplitType.PERCENT,
                        amount: transaction.amount - transaction.feeAmount,
                    })
                ];

              @core// Criar receivables
                const availableDate = input.dueDate
                    ? new Date(input.dueDate.setDate(input.dueDate.getDate() + 1))
                    : new Date(new Date().setDate(new Date().getDate() + 1));

                const receivables = splits.map(split =>
                    Receivable.create({
                        transactionId: transaction.id,
                        originalOwnerId: new UniqueEntityID(input.businessId),
                        currentOwnerId: new UniqueEntityID(input.businessId),
                        amount: split.amount,
                        netAmount: split.amount,
                        originalDueDate: input.dueDate || new Date(),
                        currentDueDate: availableDate,
                        status: ReceivableStatus.PENDING,
                        businessId: new UniqueEntityID(input.businessId),
                    })
                );
                this.logger.debug('Created receivables');

              @core// Persistir todas as entidades
                await this.pixRepository.create(transaction);
                await Promise.all(splits.map(split =>
                    this.transactionSplitRepository.create(split)
                ));
                await Promise.all(receivables.map(receivable =>
                    this.receivableRepository.create(receivable)
                ));
                this.logger.debug('All entities persisted');

              @core// Registrar métrica
                const metricResult = await this.recordTransactionMetric.execute({
                    businessId: input.businessId,
                    type: MetricType.PIX_PAYMENT,
                    amount: input.amount,
                    status: 'PENDING'
                });

                if (metricResult.isLeft()) {
                    this.logger.warn('Failed to record transaction metric:', metricResult.value);
                }

                this.logger.debug('=== CreatePixUseCase completed successfully ===');

                return right({
                    pix: transaction,
                });

            } catch (error) {
                this.logger.error('=== Error in CreatePixUseCase ===');
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

    private preparePixRequest(input: CreatePixUseCaseRequest, pagador: Person | null, beneficiario: Business): PixProps {
        const baseRequest: PixProps = {
            calendario: {
                expiracao: 3600@core// 1 hora de expiração para Pix imediato
            },
            valor: {
                original: input.amount.toFixed(2),
            },
            chave: 'db06c12c-5ff5-4efc-9f1a-144b77430896',
            solicitacaoPagador: input.description,
        };

        if (input.documentType === 'DUEDATE') {
            baseRequest.calendario = {
                dataDeVencimento: input.dueDate!.toISOString().split('T')[0],
                validadeAposVencimento: 60,
            };
        }

        if (pagador) {
            baseRequest.devedor = {
                cpf: pagador.document.length === 11 ? pagador.document : undefined,
                cnpj: pagador.document.length === 14 ? pagador.document : undefined,
                nome: pagador.name,
                logradouro: pagador.addressLine1,
                cidade: pagador.cityCode,
                uf: pagador.stateCode,
                cep: pagador.postalCode,
            };
        }

        return baseRequest;
    }

    private createPixFromResponse(input: CreatePixUseCaseRequest, response: any): Transaction {
      @core// Calcula o fee amount como 1% do valor total
        const feeAmount = Math.round(input.amount * 0.01);

        return Transaction.create({
            businessId: new UniqueEntityID(input.businessId),
            personId: input.personId ? new UniqueEntityID(input.personId) : null,
            description: input.description,
            status: 'PENDING',
            dueDate: input.dueDate || null,
            paymentLimitDate: input.paymentLimitDate || null,
            amount: input.amount,
            feeAmount: feeAmount,
            pixQrCode: response.pixCopiaECola,
            pixId: response.txid,
            type: TransactionType.PIX,
        });
    }
}