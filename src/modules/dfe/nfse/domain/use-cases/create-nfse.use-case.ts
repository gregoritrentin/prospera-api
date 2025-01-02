import { Injectable, Inject } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { I18nService, Language } from '@/i18n/i18n.service'
import { AppError } from '@/core/error/app-errors'
import { QueueProvider } from '@/modules/providers/domain/queue-provider'
import {
    RpsType,
    NfseStatus,
    OperationType,
    IssRequirement,
    ServiceCode
} from '@/core/utils/enums'

// src/domain/nfse/use-cases/create-nfse.use-case.ts
export interface CreateNfseUseCaseRequest {
    // Identificação
    businessId: string;
    personId: string;

    // RPS Info
    rpsNumber: string;
    rpsSeries: string;
    rpsType: RpsType;

    // Datas
    issueDate: Date;
    competenceDate: Date;

    // Serviço
    description: string;
    additionalInformation?: string | null;
    operationType: OperationType;
    serviceCode: ServiceCode;
    issRequirement: IssRequirement;
    cnaeCode: string;
    cityTaxCode?: string | null;
    issRetention: boolean;

    // Valores
    serviceAmount: number;
    unconditionalDiscount: number;
    conditionalDiscount: number;
    calculationBase: number;

    // Alíquotas
    issRate: number;
    pisRate?: number;
    cofinsRate?: number;
    irRate?: number;
    inssRate?: number;
    csllRate?: number;

    // Localização
    incidenceState: string;
    incidenceCity: string;
    serviceState: string;
    serviceCity: string;
}

type CreateNfseUseCaseResponse = Either<
    AppError,
    {
        jobId: string;
        message: string;
    }
>;

@Injectable()
export class CreateNfseUseCase {
    constructor(
        private i18nService: I18nService,
        @Inject(QueueProvider)
        private queueService: QueueProvider
    ) { }

    async execute(
        request: CreateNfseUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<CreateNfseUseCaseResponse> {
        try {
            const validationResult = this.validateNfse(request);
            if (validationResult !== true) {
                return left(validationResult);
            }

            try {
                // Enfileira o job de criação da NFSe
                const result = await this.queueService.addJob(
                    'nfse',
                    'create-nfse',
                    {
                        request,
                        language
                    }
                );

                return right({
                    jobId: result.jobId,
                    message: this.i18nService.translate('messages.NFSE_CREATION_QUEUED', language)
                });
            } catch (error) {
                return left(
                    AppError.internalServerError(
                        this.i18nService.translate('errors.FAILED_TO_QUEUE_NFSE', language)
                    )
                );
            }
        } catch (error) {
            const errorMessage = this.i18nService.translate('errors.NFSE_CREATION_ERROR', language, {
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            return left(AppError.internalServerError(errorMessage));
        }
    }

    private validateNfse(request: CreateNfseUseCaseRequest): true | AppError {
        // Validação das datas
        const issueDate = new Date(request.issueDate);
        const competenceDate = new Date(request.competenceDate);

        competenceDate.setHours(0, 0, 0, 0);
        issueDate.setHours(0, 0, 0, 0);

        // if (issueDate < competenceDate) {
        //   return AppError.invalidDate('errors.ISSUE_DATE_BEFORE_COMPETENCE');
        // }

        // Validação do valor do serviço
        // if (request.serviceAmount <= 0) {
        //   return AppError.invalidAmount('errors.INVALID_SERVICE_AMOUNT');
        // }

        // Validação da base de cálculo
        const expectedBase = request.serviceAmount -
            (request.unconditionalDiscount || 0) -
            (request.conditionalDiscount || 0);

        // if (Math.abs(expectedBase - request.calculationBase) > 0.01) {
        //   return AppError.validationError('errors.CALCULATION_BASE_MISMATCH');
        // }

        // // Validação das alíquotas
        // if (request.issRate < 0 || request.issRate > 100) {
        //   return AppError.validationError('errors.INVALID_ISS_RATE');
        // }

        // // Validação do código de serviço
        // if (!Object.values(ServiceCode).includes(request.serviceCode)) {
        //   return AppError.validationError('errors.INVALID_SERVICE_CODE');
        // }

        // // Validação das cidades
        // if (request.incidenceCity !== request.serviceCity && 
        //     request.operationType === OperationType.TAXATION_IN_CITY) {
        //   return AppError.validationError('errors.CITY_MISMATCH_FOR_LOCAL_TAXATION');
        // }

        // // Validação do RPS
        // if (!request.rpsNumber || !request.rpsSeries) {
        //   return AppError.validationError('errors.INVALID_RPS');
        // }

        return true;
    }
}