import { right, left, Either } from '@/core/either';
import { TransactionType } from '@/domain/transaction/entities/transaction';

import { Injectable, Logger } from '@nestjs/common';
import { Transaction } from '@/domain/transaction/entities/transaction';
import { Person } from '@/domain/person/entities/person';
import { Business } from '@/domain/application/entities/business';
import { TransactionRepository } from '@/domain/transaction/repositories/transaction-repository';
import { PersonsRepository } from '@/domain/person/repositories/persons-repository';
import { BusinessRepository } from '@/domain/application/repositories/business-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { BoletoProvider, BoletoProps } from '../../interfaces/boleto-provider';
import { I18nService, Language } from '@/i18n/i18n.service';
import { BoletoQueueProducer } from '@/infra/queues/producers/boleto-queue-producer';
import { AppError } from '@/core/errors/app-errors';

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
        private boletoProvider: BoletoProvider,
        private boletoRepository: TransactionRepository,
        private personsRepository: PersonsRepository,
        private businessRepository: BusinessRepository,
        private i18nService: I18nService,
        private boletoQueueProducer: BoletoQueueProducer,
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

        try {
            if (input.amount <= 0) {
                this.logger.debug(`Invalid amount: ${input.amount}`);
                return left(AppError.invalidAmount(input.amount));
            }

            if (input.dueDate <= new Date()) {
                this.logger.debug(`Invalid due date: ${input.dueDate}`);
                return left(AppError.invalidDueDate());
            }

            this.logger.debug('Fetching pagador and beneficiario');
            const [pagador, beneficiario] = await Promise.all([
                this.personsRepository.findById(input.personId, input.businessId),
                this.businessRepository.findById(input.businessId)
            ]);

            if (!pagador || !beneficiario) {
                this.logger.debug('Pagador or beneficiario not found');
                return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'));
            }

            this.logger.debug('Preparing boleto request');
            const boletoRequest = this.prepareBoletoRequest(input, pagador, beneficiario);
            this.logger.debug('Boleto request:', boletoRequest);

            this.logger.debug('Calling boleto provider');
            const boletoResponse = await this.boletoProvider.createBoleto(boletoRequest);
            this.logger.debug('Boleto provider response:', boletoResponse);

            const boleto = this.createBoletoFromSicrediResponse(input, boletoResponse);
            this.logger.debug('Created boleto entity:', {
                id: boleto.id.toString(),
                status: boleto.status
            });

            await this.boletoRepository.create(boleto);
            this.logger.debug('Boleto saved to repository');

            await this.boletoQueueProducer.addPrintBoletoJob({
                businessId: input.businessId,
                boletoId: boleto.id.toString(),
                language,
            });
            this.logger.debug('Print job added to queue');

            const successMessage = this.i18nService.translate('messages.RECORD_CREATED', language);
            this.logger.debug('=== CreateBoletoUseCase completed successfully ===');

            return right({ boleto, message: successMessage });

        } catch (error) {
            this.logger.error('=== Error in CreateBoletoUseCase ===');
            this.logger.error('Error details:', error instanceof Error ? {
                message: error.message,
                stack: error.stack
            } : String(error));

            const errorMessage = this.i18nService.translate('errors.SICREDI_ERROR_CREATE_BOLETO', language, {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return left(AppError.boletoCreationFailed());
        }
    }

    private prepareBoletoRequest(input: CreateBoletoUseCaseRequest, pagador: Person, beneficiario: Business): BoletoProps {
        return {
            tipoCobranca: 'HIBRIDO',
            pagador: {
                tipoPessoa: this.getTipoPessoa(pagador.document),
                documento: pagador.document,
                nome: pagador.name,
                endereco: pagador.addressLine1,
                cidade: 'ERECHIM', // Considere usar pagador.cityCode se disponível
                uf: 'RS', // Considere usar pagador.stateCode se disponível
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
            status: 'PENDING',
            feeAmount: 1,
            pixQrCode: sicrediResponse.qrCode,
            pixId: sicrediResponse.txid,
            ourNumber: sicrediResponse.nossoNumero || null,
            fileId: null,
            type: TransactionType.BOLETO,
        });
    }

    private getTipoPessoa(document: string): 'PESSOA_FISICA' | 'PESSOA_JURIDICA' {
        return document.replace(/\D/g, '').length === 11 ? 'PESSOA_FISICA' : 'PESSOA_JURIDICA';
    }
}