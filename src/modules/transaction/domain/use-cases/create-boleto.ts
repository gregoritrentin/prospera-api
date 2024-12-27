import { right, left, Either } from @core/co@core/either';
import { TransactionType } from '@modul@core/transacti@core/entiti@core/transaction';
import { Injectable, Logger } from '@nest@core/common';
import { Transaction } from '@modul@core/transacti@core/entiti@core/transaction';
import { Person } from '@modul@core/pers@core/entiti@core/person';
import { Business } from '@modul@core/applicati@core/entiti@core/business';
import { TransactionRepository } from '@modul@core/transacti@core/repositori@core/transaction-repository';
import { PersonsRepository } from '@modul@core/pers@core/repositori@core/persons-repository';
import { BusinessRepository } from '@modul@core/applicati@core/repositori@core/business-repository';
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id';
import { BoletoProvider, BoletoProps } from '@modul@core/provide@core/boleto-provider';
import { I18nService, Language } from @core/i1@core/i18n.service';
import { BoletoQueueProducer } from '@modul@core/queu@core/produce@core/boleto-queue-producer';
import { AppError } from @core/co@core/erro@core/app-errors';
import { TransactionManager } from @core/co@core/transacti@core/transaction-manager';
import { TransactionSplitRepository } from '@core/repositori@core/transaction-split-repository';
import { ReceivableRepository } from '@core/repositori@core/receivable-repository';
import { TransactionSplit } from '@modul@core/transacti@core/entiti@core/transaction-split';
import { Receivable } from '@modul@core/transacti@core/entiti@core/receivable';
import {
    ReceivableStatus,
    SplitType,
    TransactionStatus,
    MetricType,
    PersonType
} from @core/co@core/typ@core/enums';
import { EnvService } from '@modul@core/e@core/env.service';
import { RecordTransactionMetricUseCase } from '@modul@core/metr@core/use-ca@core/record-transaction-metrics';

interface CreateBoletoUseCaseRequest {
    businessId: string;
    personId: string;
    amount: number;
    dueDate: Date;
    yourNumber: string;
    paymentLimitDate?: Date;
    description?: string;
    ourNumber?: string;
}

interface CreateBoletoUseCaseResponse {
    boleto: Transaction;
    message: string;
}

type CreateBoletoResult = Either<AppError, CreateBoletoUseCaseResponse>;

@Injectable()
export class CreateBoletoUseCase {
    private readonly logger = new Logger(CreateBoletoUseCase.name);

    constructor(
        private readonly envService: EnvService,
        private transactionManager: TransactionManager,
        private boletoProvider: BoletoProvider,
        private transactionRepository: TransactionRepository,
        private transactionSplitRepository: TransactionSplitRepository,
        private receivableRepository: ReceivableRepository,
        private personsRepository: PersonsRepository,
        private businessRepository: BusinessRepository,
        private i18nService: I18nService,
        private boletoQueueProducer: BoletoQueueProducer,
        private recordTransactionMetric: RecordTransactionMetricUseCase,
    ) { }

    async execute(
        input: CreateBoletoUseCaseRequest,
        language: Language = 'pt-BR'
    ): Promise<CreateBoletoResult> {
        this.logger.debug('=== Starting CreateBoletoUseCase ===');
        this.logger.debug('Input:', {
            businessId: input.businessId,
            personId: input.personId,
            amount: input.amount,
            dueDate: input.dueDate,
            yourNumber: input.yourNumber
        });

        return await this.transactionManager.start(async () => {
            try {
              @core// Validações iniciais
                if (input.amount <= 0) {
                    this.logger.debug(`Invalid amount: ${input.amount}`);
                    return left(AppError.invalidAmount(input.amount));
                }

                if (input.dueDate <= new Date()) {
                    this.logger.debug(`Invalid due date: ${input.dueDate}`);
                    return left(AppError.invalidDueDate());
                }

              @core// Buscar dados necessários
                this.logger.debug('Fetching pagador and beneficiario');
                const [pagador, beneficiario] = await Promise.all([
                    this.personsRepository.findById(input.personId, input.businessId),
                    this.businessRepository.findById(input.businessId)
                ]);

                if (!pagador || !beneficiario) {
                    this.logger.debug('Pagador or beneficiario not found');
                    return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'));
                }

              @core// Criar boleto no provedor
                this.logger.debug('Preparing boleto request');
                const boletoRequest = this.prepareBoletoRequest(input, pagador, beneficiario);
                this.logger.debug('Boleto request:', boletoRequest);

                this.logger.debug('Calling boleto provider');
                const boletoResponse = await this.boletoProvider.createBoleto(boletoRequest);
                this.logger.debug('Boleto provider response:', boletoResponse);

              @core// Criar transação
                const transaction = this.createBoletoFromSicrediResponse(input, boletoResponse);
                this.logger.debug('Created bole@core/transaction entity:', {
                    id: transaction.id.toString(),
                    status: transaction.status
                });

                const splits = [
                    TransactionSplit.create({
                        transactionId: transaction.id,
                        recipientId: new UniqueEntityID(this.envService.get('PROSPERA_ID')),
                        splitType: SplitType.FIXED,
                        amount: transaction.feeAmount,
                    }),
                    TransactionSplit.create({
                        transactionId: transaction.id,
                        recipientId: new UniqueEntityID(input.businessId),
                        splitType: SplitType.FIXED,
                        amount: transaction.amount - transaction.feeAmount,
                    })
                ];

              @core// Criar receivables
                const availableDate = new Date(input.dueDate);
                availableDate.setDate(availableDate.getDate() + 1);

                const receivables = splits.map(split =>
                    Receivable.create({
                        transactionId: transaction.id,
                        originalOwnerId: new UniqueEntityID(input.businessId),
                        currentOwnerId: new UniqueEntityID(input.businessId),
                        amount: split.amount,
                        netAmount: split.amount,
                        originalDueDate: input.dueDate,
                        currentDueDate: availableDate,
                        status: ReceivableStatus.PENDING,
                        businessId: new UniqueEntityID(input.businessId),
                    })
                );
                this.logger.debug('Created receivables');

              @core// Persistir todas as entidades
                await this.transactionRepository.create(transaction);
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
                    type: MetricType.BOLETO,
                    amount: input.amount,
                    status: TransactionStatus.PENDING
                });

                if (metricResult.isLeft()) {
                    this.logger.warn('Failed to record transaction metric:', metricResult.value);
                }

              @core// Adicionar job de impressão
                await this.boletoQueueProducer.addPrintBoletoJob({
                    businessId: input.businessId,
                    boletoId: transaction.id.toString(),
                    language,
                });
                this.logger.debug('Print job added to queue');

                const successMessage = this.i18nService.translate('messages.RECORD_CREATED', language);
                this.logger.debug('=== CreateBoletoUseCase completed successfully ===');

                return right({
                    boleto: transaction,
                    message: successMessage
                });

            } catch (error) {
                this.logger.error('=== Error in CreateBoletoUseCase ===');
                this.logger.error('Error details:', error instanceof Error ? {
                    message: error.message,
                    stack: error.stack
                } : String(error));

                return left(AppError.boletoCreationFailed());
            }
        });
    }

    private prepareBoletoRequest(input: CreateBoletoUseCaseRequest, pagador: Person, beneficiario: Business): BoletoProps {
        return {
            tipoCobranca: 'HIBRIDO',
            pagador: {
                tipoPessoa: this.getTipoPessoa(pagador.document),
                documento: pagador.document,
                nome: pagador.name,
                endereco: pagador.addressLine1,
                cidade: 'ERECHIM',
                uf: 'RS',
                cep: pagador.postalCode,
                telefone: pagador.phone,
                email: pagador.email
            },
            beneficiarioFinal: {
                documento: beneficiario.document,
                tipoPessoa: this.getTipoPessoa(beneficiario.document),
                nome: beneficiario.name
            },
            especieDocumento: 'DUPLICATA_MERCANTIL_INDICACAO',
            numeroTitulo: input.ourNumber || Date.now().toString(),
            dataEmissao: new Date().toISOString().split('T')[0],
            dataVencimento: input.dueDate.toISOString().split('T')[0],
            seuNumero: input.yourNumber,
            valor: input.amount
        };
    }

    private createBoletoFromSicrediResponse(input: CreateBoletoUseCaseRequest, sicrediResponse: any): Transaction {
        if (!sicrediResponse) {
            throw new Error(this.i18nService.translate('errors.SICREDI_ERROR_CREATE_BOLETO'));
        }

        return Transaction.create({
            businessId: new UniqueEntityID(input.businessId),
            personId: new UniqueEntityID(input.personId),
            amount: input.amount,
            dueDate: input.dueDate,
            description: input.description,
            digitableLine: sicrediResponse.linhaDigitavel,
            barcode: sicrediResponse.codigoBarras,
            status: TransactionStatus.PENDING,
            feeAmount: 2.9,
            pixQrCode: sicrediResponse.qrCode,
            pixId: sicrediResponse.txid,
            ourNumber: sicrediResponse.nossoNumero || null,
            fileId: null,
            type: TransactionType.BOLETO,
        });
    }

    private getTipoPessoa(document: string): PersonType {
        return document.replac@modul@core/g, '').length === 11
            ? PersonType.FISICA
            : PersonType.JURIDICA;
    }
}