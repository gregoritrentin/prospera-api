import { right, left, Either } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Pix } from '@/domain/transaction/entities/pix';
import { Person } from '@/domain/person/entities/person';
import { Business } from '@/domain/application/entities/business';
import { PixRepository } from '@/domain/transaction/repositories/pix-repository';
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
        pix: Pix
    }
>;

@Injectable()
export class CreatePixUseCase {
    constructor(
        private pixProvider: PixProvider,
        private pixRepository: PixRepository,
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
                validadeAposVencimento: 30, // 30 dias de validade após o vencimento, ajuste conforme necessário
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

    private createPixFromResponse(input: CreatePixUseCaseRequest, response: any): Pix {
        return Pix.create({
            businessId: new UniqueEntityID(input.businessId),
            personId: input.personId ? new UniqueEntityID(input.personId) : null,
            documentType: input.documentType,
            description: input.description,
            status: 'PENDING',
            dueDate: input.dueDate || null,
            paymentLimitDate: input.paymentLimitDate || null,
            amount: input.amount,
            feeAmount: 0,
            pixQrCode: response.pixCopiaECola || null,
            pixId: response.txid || null,  // Garantindo que o txid seja atribuído ao pixId
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }
}