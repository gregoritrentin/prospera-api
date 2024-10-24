import { right, left, Either } from '@/core/either';
import { TransactionType } from '@/domain/transaction/entities/transaction';

import { Injectable } from '@nestjs/common';
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
        try {

            if (input.amount <= 0) {
                return left(AppError.invalidAmount(input.amount));
            }

            if (input.dueDate <= new Date()) {
                return left(AppError.invalidDueDate());
            }

            const [pagador, beneficiario] = await Promise.all([
                this.personsRepository.findById(input.personId, input.businessId),
                this.businessRepository.findById(input.businessId)
            ]);

            if (!pagador || !beneficiario) {
                return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'));
            }

            const boletoRequest = this.prepareBoletoRequest(input, pagador, beneficiario);
            const boletoResponse = await this.boletoProvider.createBoleto(boletoRequest);

            const boleto = this.createBoletoFromSicrediResponse(input, boletoResponse);
            await this.boletoRepository.create(boleto);

            await this.boletoQueueProducer.addPrintBoletoJob({
                businessId: input.businessId,
                boletoId: boleto.id.toString(),
                language,
            });

            const successMessage = this.i18nService.translate('messages.RECORD_CREATED', language);

            return right({ boleto, message: successMessage });

        } catch (error) {
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