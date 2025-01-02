import { Injectable } from '@nestjs/common'
import { Either, left, right } from '@/core/either'
import { NfseRepository } from '@/modules//domain/dfe/nfse/repositories/nfse-repository'
import { I18nService, Language } from '@/i18n/i18n.service'
import { AppError } from '@/core/error/app-errors'
import { Nfse } from '@/modules//domain/dfe/nfse/entities/nfse'
import { NfseEvent } from '@/modules//domain/dfe/nfse/entities/nfse-event'
import {
    RpsType,
    NfseStatus,
    OperationType,
    IssRequirement,
    ServiceCode,
    NfseEventType,
    NfseEventStatus
} from '@/core/utils/enums'

// src/domain/nfse/use-cases/edit-nfse.use-case.ts
export interface EditNfseUseCaseRequest {
    businessId: string
    nfseId: string

    rpsNumber: string
    rpsSeries: string
    rpsType: RpsType

    issueDate: Date
    competenceDate: Date

    description: string
    additionalInformation?: string | null
    operationType: OperationType
    serviceCode: ServiceCode
    issRequirement: IssRequirement
    cnaeCode: string
    cityTaxCode?: string | null
    issRetention: boolean

    serviceAmount: number
    unconditionalDiscount: number
    conditionalDiscount: number
    calculationBase: number

    issRate: number
    pisRate?: number
    cofinsRate?: number
    irRate?: number
    inssRate?: number
    csllRate?: number

    incidenceState: string
    incidenceCity: string
    serviceState: string
    serviceCity: string
}

type EditNfseUseCaseResponse = Either<
    AppError,
    {
        nfse: Nfse
        message: string
    }
>

@Injectable()
export class EditNfseUseCase {
    constructor(
        private nfseRepository: NfseRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: EditNfseUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<EditNfseUseCaseResponse> {
        const nfse = await this.nfseRepository.findById(request.nfseId, request.businessId)

        if (!nfse) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (request.businessId !== nfse.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'))
        }

        // Validação de status para edição
        const editableStatus = [
            NfseStatus.DRAFT,
            NfseStatus.ERROR,
            NfseStatus.REJECTED
        ]

        if (!editableStatus.includes(nfse.status)) {
            return left(
                AppError.notAllowed(
                    'errors.CANNOT_EDIT_NFSE_WITH_STATUS',
                    { status: nfse.status }
                )
            )
        }

        const validationResult = this.validateNfse(request)
        if (validationResult !== true) {
            return left(validationResult)
        }

        this.updateNfseEntity(nfse, request)

        await this.nfseRepository.save(nfse)

        return right({
            nfse,
            message: this.i18nService.translate('messages.RECORD_UPDATED', language)
        })
    }

    private validateNfse(request: EditNfseUseCaseRequest): true | AppError {
        // Validação das datas
        const issueDate = new Date(request.issueDate)
        const competenceDate = new Date(request.competenceDate)

        competenceDate.setHours(0, 0, 0, 0)
        issueDate.setHours(0, 0, 0, 0)

        // if (issueDate < competenceDate) {
        //   return AppError.invalidDate('errors.ISSUE_DATE_BEFORE_COMPETENCE')
        // }

        // // Validação do valor do serviço
        // if (request.serviceAmount <= 0) {
        //   return AppError.invalidAmount('errors.INVALID_SERVICE_AMOUNT')
        // }

        // Validação da base de cálculo
        const expectedBase = request.serviceAmount -
            (request.unconditionalDiscount || 0) -
            (request.conditionalDiscount || 0)

        // if (Math.abs(expectedBase - request.calculationBase) > 0.01) {
        //   return AppError.validationError('errors.CALCULATION_BASE_MISMATCH')
        // }

        // // Validação das alíquotas
        // if (request.issRate < 0 || request.issRate > 100) {
        //   return AppError.validationError('errors.INVALID_ISS_RATE')
        // }

        // // Validação do RPS
        // if (!request.rpsNumber || !request.rpsSeries) {
        //   return AppError.validationError('errors.INVALID_RPS')
        // }

        return true
    }

    private updateNfseEntity(nfse: Nfse, request: EditNfseUseCaseRequest) {
        // RPS Info
        nfse.rpsNumber = request.rpsNumber
        nfse.rpsSeries = request.rpsSeries
        nfse.rpsType = request.rpsType

        // Datas
        nfse.issueDate = request.issueDate
        nfse.competenceDate = request.competenceDate

        // Serviço
        nfse.description = request.description
        nfse.additionalInformation = request.additionalInformation
        nfse.operationType = request.operationType
        nfse.serviceCode = request.serviceCode
        nfse.issRequirement = request.issRequirement
        nfse.cnaeCode = request.cnaeCode
        nfse.cityTaxCode = request.cityTaxCode
        nfse.issRetention = request.issRetention

        // Valores
        nfse.serviceAmount = request.serviceAmount
        nfse.unconditionalDiscount = request.unconditionalDiscount
        nfse.conditionalDiscount = request.conditionalDiscount
        nfse.calculationBase = request.calculationBase

        // Alíquotas e valores calculados
        nfse.issRate = request.issRate
        nfse.pisRate = request.pisRate ?? 0
        nfse.cofinsRate = request.cofinsRate ?? 0
        nfse.irRate = request.irRate ?? 0
        nfse.inssRate = request.inssRate ?? 0
        nfse.csllRate = request.csllRate ?? 0

        // Calcular valores dos impostos
        nfse.issAmount = (request.calculationBase * request.issRate) / 100
        nfse.pisAmount = request.pisRate ? (request.calculationBase * request.pisRate) / 100 : 0
        nfse.cofinsAmount = request.cofinsRate ? (request.calculationBase * request.cofinsRate) / 100 : 0
        nfse.irAmount = request.irRate ? (request.calculationBase * request.irRate) / 100 : 0
        nfse.inssAmount = request.inssRate ? (request.calculationBase * request.inssRate) / 100 : 0
        nfse.csllAmount = request.csllRate ? (request.calculationBase * request.csllRate) / 100 : 0

        // Localização
        nfse.incidenceState = request.incidenceState
        nfse.incidenceCity = request.incidenceCity
        nfse.serviceState = request.serviceState
        nfse.serviceCity = request.serviceCity

        // Registrar evento de edição
        const editEvent = NfseEvent.create({
            nfseId: nfse.id,
            type: NfseEventType.STATUS_UPDATE,
            status: NfseEventStatus.SUCCESS,
            message: 'NFSe edited',
            payload: request
        })

        nfse.addEvent(editEvent)
    }
}