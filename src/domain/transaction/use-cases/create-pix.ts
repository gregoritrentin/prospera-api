import { right, left, Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Transaction, TransactionType } from '@/domain/transaction/entities/transaction';
import { Person } from '@/domain/person/entities/person';
import { Business } from '@/domain/application/entities/business';
import { TransactionRepository } from '@/domain/transaction/repositories/transaction-repository';
import { PersonsRepository } from '@/domain/person/repositories/persons-repository';
import { BusinessRepository } from '@/domain/application/repositories/business-repository';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { PixProvider, PixProps } from '../../interfaces/pix-provider';
import { AppError } from '@/core/errors/app-errors';

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
        pix: Transaction
    }
>;

@Injectable()
export class CreatePixUseCase {
    constructor(
        private pixProvider: PixProvider,
        private pixRepository: TransactionRepository,
        private personsRepository: PersonsRepository,
        private businessRepository: BusinessRepository,
    ) { }

    async execute(input: CreatePixUseCaseRequest): Promise<CreatePixUseCaseResponse> {
        // Validações
        if (input.amount <= 0) {
            return left(AppError.invalidAmount(input.amount));
        }

        if (input.documentType === 'DUEDATE') {
            if (!input.dueDate) {
                return left(AppError.invalidDueDate());
            }
            if (input.dueDate <= new Date()) {
                return left(AppError.invalidDueDate());
            }
            if (!input.personId) {
                return left(AppError.badRequest('errors.PERSON_ID_REQUIRED_FOR_DUEDATE'));
            }
        }

        const business = await this.businessRepository.findById(input.businessId);
        if (!business) {
            return left(AppError.resourceNotFound('errors.BUSINESS_NOT_FOUND'));
        }

        let devedor: Person | null = null;
        if (input.personId) {
            devedor = await this.personsRepository.findById(input.personId, input.businessId);
            if (!devedor) {
                return left(AppError.resourceNotFound('errors.PERSON_NOT_FOUND'));
            }
        }

        try {
            // Preparar a requisição do Pix
            const pixRequest: PixProps = this.preparePixRequest(input, devedor, business);

            // Criar o Pix usando o provedor apropriado
            let pixResponse;
            if (input.documentType === 'IMMEDIATE') {
                pixResponse = await this.pixProvider.createPixImediato(pixRequest);
            } else {
                pixResponse = await this.pixProvider.createPixVencimento(pixRequest);
            }

            // Criar a entidade Pix
            const pix = this.createPixFromResponse(input, pixResponse);

            // Persistir o Pix no repositório
            await this.pixRepository.create(pix);

            const savedPix = pix;

            return right({
                pix: savedPix,
            });

        } catch (error) {
            console.error('Error creating Pix:', error);
            if (error instanceof AppError) {
                return left(error);
            }
            return left(AppError.pixCreationFailed({
                message: error instanceof Error ? error.message : 'Erro desconhecido ao criar PIX'
            }));
        }
    }

    private preparePixRequest(input: CreatePixUseCaseRequest, pagador: Person | null, beneficiario: Business): PixProps {
        const baseRequest: PixProps = {
            calendario: {
                expiracao: 3600, // 1 hora de expiração para Pix imediato
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
        return Transaction.create({
            businessId: new UniqueEntityID(input.businessId),
            personId: input.personId ? new UniqueEntityID(input.personId) : null,
            description: input.description,
            status: 'PENDING',
            dueDate: input.dueDate || null,
            paymentLimitDate: input.paymentLimitDate || null,
            amount: input.amount,
            feeAmount: 1,
            pixQrCode: response.pixCopiaECola,
            pixId: response.txid,
            type: TransactionType.PIX,

        });
    }
}