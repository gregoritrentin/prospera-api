// src/domain/nfse/entities/value-objects/nfse-details.ts
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import {
    NfseStatus,
    RpsType,
    OperationType,
    IssRequirement,
    ServiceCode
} from '@/core/types/enums'

export interface NfseEventSummary {
    id: string
    type: string
    status: string
    message?: string
    createdAt: Date
}
interface NfseDetailsProps {
    // Identificação básica
    businessId: UniqueEntityID
    businessName: string
    businessDocument: string
    businessCityCode: string
    businessInscricaoMunicipal: string

    personId: UniqueEntityID
    personName: string
    personDocument: string
    personEmail?: string | null
    personPhone?: string | null

    // RPS Info
    rpsNumber: string
    rpsSeries: string
    rpsType: RpsType

    // Datas
    issueDate: Date
    competenceDate: Date

    // Descrição do Serviço
    description: string
    additionalInformation?: string | null
    operationType: OperationType
    serviceCode: ServiceCode
    serviceName: string
    issRequirement: IssRequirement
    cnaeCode: string
    cityTaxCode?: string | null
    issRetention: boolean

    // Valores
    serviceAmount: number
    unconditionalDiscount: number
    conditionalDiscount: number
    calculationBase: number
    netAmount: number

    // Taxas
    issRate: number
    pisRate: number
    cofinsRate: number
    irRate: number
    inssRate: number
    csllRate: number

    // Valores de impostos
    issAmount: number
    pisAmount: number
    cofinsAmount: number
    inssAmount: number
    irAmount: number
    csllAmount: number
    otherRetentions: number

    // Localização
    incidenceState: string
    incidenceCity: string
    serviceState: string
    serviceCity: string

    // Controle
    status: NfseStatus
    batchNumber?: string | null
    protocol?: string | null
    nfseNumber?: string | null

    substituteNfseNumber?: string | null
    substituteReason?: string | null
    cancelReason?: string | null

    // Arquivos
    pdfFileId?: string | null
    xmlFileId?: string | null

    // Events
    eventsCount: number
    eventsDetails: NfseEventSummary[]

    // Timestamps
    createdAt: Date
    updatedAt?: Date | null
    canceledAt?: Date | null
}

export class NfseDetails extends ValueObject<NfseDetailsProps> {
    // Basic getters
    get businessId() {
        return this.props.businessId
    }

    get businessName() {
        return this.props.businessName
    }

    get businessDocument() {
        return this.props.businessDocument
    }

    get businessCityCode() {
        return this.props.businessCityCode
    }

    get businessInscricaoMunicipal() {
        return this.props.businessInscricaoMunicipal
    }

    get personId() {
        return this.props.personId
    }

    get personName() {
        return this.props.personName
    }

    get personDocument() {
        return this.props.personDocument
    }

    get personEmail() {
        return this.props.personEmail
    }

    get personPhone() {
        return this.props.personPhone
    }

    // RPS getters
    get rpsNumber() {
        return this.props.rpsNumber
    }

    get rpsSeries() {
        return this.props.rpsSeries
    }

    get rpsType() {
        return this.props.rpsType
    }

    // Date getters
    get issueDate() {
        return this.props.issueDate
    }

    get competenceDate() {
        return this.props.competenceDate
    }

    // Service getters
    get description() {
        return this.props.description
    }

    get additionalInformation() {
        return this.props.additionalInformation
    }

    get operationType() {
        return this.props.operationType
    }

    get serviceCode() {
        return this.props.serviceCode
    }

    get serviceName() {
        return this.props.serviceName
    }

    get issRequirement() {
        return this.props.issRequirement
    }

    // Values getters
    get serviceAmount() {
        return this.props.serviceAmount
    }

    get unconditionalDiscount() {
        return this.props.unconditionalDiscount
    }

    get conditionalDiscount() {
        return this.props.conditionalDiscount
    }

    get calculationBase() {
        return this.props.calculationBase
    }

    get netAmount() {
        return this.props.netAmount
    }

    // Tax rates getters
    get issRate() {
        return this.props.issRate
    }

    get pisRate() {
        return this.props.pisRate
    }

    get cofinsRate() {
        return this.props.cofinsRate
    }

    // Tax amounts getters
    get issAmount() {
        return this.props.issAmount
    }

    get pisAmount() {
        return this.props.pisAmount
    }

    get cofinsAmount() {
        return this.props.cofinsAmount
    }

    // Control getters
    get status() {
        return this.props.status
    }

    get nfseNumber() {
        return this.props.nfseNumber
    }

    get protocol() {
        return this.props.protocol
    }

    // Event getters
    get eventsCount() {
        return this.props.eventsCount
    }

    get eventsDetails() {
        return this.props.eventsDetails
    }

    // Timestamps getters
    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    get canceledAt() {
        return this.props.canceledAt
    }

    // Computed properties
    get totalTaxAmount() {
        return (
            this.issAmount +
            this.pisAmount +
            this.cofinsAmount //+
            //this.inssAmount +
            //this.irAmount +
            //this.csllAmount +
            //this.otherRetentions
        )
    }

    get isAuthorized() {
        return this.status === NfseStatus.AUTHORIZED
    }

    get isCanceled() {
        return this.status === NfseStatus.CANCELED
    }

    get hasErrors() {
        return this.status === NfseStatus.ERROR
    }

    get formattedStatus() {
        return this.status.charAt(0).toUpperCase() + this.status.slice(1).toLowerCase()
    }

    get hasEvents() {
        return this.eventsCount > 0
    }

    // Validation methods
    canBeCanceled(): boolean {
        if (this.isCanceled) return false
        if (!this.isAuthorized) return false

        // Verifica se está dentro do prazo de cancelamento (20 dias)
        const cancellationLimit = new Date(this.issueDate)
        cancellationLimit.setDate(cancellationLimit.getDate() + 20)
        return new Date() <= cancellationLimit
    }

    canBeReplaced(): boolean {
        return this.canBeCanceled()
    }

    static create(props: NfseDetailsProps) {
        return new NfseDetails(props)
    }
}