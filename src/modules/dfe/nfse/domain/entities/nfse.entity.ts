import { AggregateRoot } from '@/core/domain/entity/aggregate-root'
import { UniqueEntityID } from '@/core/domain/entity/unique-entity-id'
import { Optional } from '@/core/utils/optional'
import {
    RpsType,
    NfseStatus,
    OperationType,
    IssRequirement,
    ServiceCode,
    NfseCancelReason
} from '@/core/utils/enums'
import { NfseEvent } from 'nfse-event.entity'

export interface NfseProps {
    businessId: UniqueEntityID
    personId: UniqueEntityID

    // RPS Info
    rpsNumber: string
    rpsSeries: string
    rpsType: RpsType

    // Dates
    issueDate: Date
    competenceDate: Date

    // Service Description
    description: string
    additionalInformation?: string | null
    operationType: OperationType
    serviceCode: ServiceCode
    issRequirement: IssRequirement
    cnaeCode: string
    cityTaxCode?: string | null
    issRetention: boolean

    // Values
    serviceAmount: number
    unconditionalDiscount: number
    conditionalDiscount: number
    calculationBase: number
    netAmount: number

    // Tax Rates
    issRate: number
    pisRate: number
    cofinsRate: number
    irRate: number
    inssRate: number
    csllRate: number

    // Tax Amounts
    issAmount: number
    pisAmount: number
    cofinsAmount: number
    inssAmount: number
    irAmount: number
    csllAmount: number
    otherRetentions: number

    // Location
    incidenceState: string
    incidenceCity: string
    serviceState: string
    serviceCity: string

    // Control
    status: NfseStatus
    batchNumber?: string | null
    protocol?: string | null
    nfseNumber?: string | null

    substituteNfseNumber?: string | null
    substituteReason?: string | null
    cancelReason?: NfseCancelReason | null

    // Files
    pdfFileId?: string | null
    xmlFileId?: string | null

    // Timestamps
    createdAt: Date
    updatedAt?: Date | null
    canceledAt?: Date | null

    // Collections
    events: NfseEvent[]
}

export class Nfse extends AggregateRoot<NfseProps> {
    // Basic getters
    get businessId() {
        return this.props.businessId
    }

    get personId() {
        return this.props.personId
    }

    get rpsNumber() {
        return this.props.rpsNumber
    }

    get rpsSeries() {
        return this.props.rpsSeries
    }

    get rpsType() {
        return this.props.rpsType
    }

    get issueDate() {
        return this.props.issueDate
    }

    get competenceDate() {
        return this.props.competenceDate
    }

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

    get issRequirement() {
        return this.props.issRequirement
    }

    get cnaeCode() {
        return this.props.cnaeCode
    }

    get cityTaxCode() {
        return this.props.cityTaxCode
    }

    get issRetention() {
        return this.props.issRetention
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

    get irRate() {
        return this.props.irRate
    }

    get inssRate() {
        return this.props.inssRate
    }

    get csllRate() {
        return this.props.csllRate
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

    get inssAmount() {
        return this.props.inssAmount
    }

    get irAmount() {
        return this.props.irAmount
    }

    get csllAmount() {
        return this.props.csllAmount
    }

    get otherRetentions() {
        return this.props.otherRetentions
    }

    // Location getters
    get incidenceState() {
        return this.props.incidenceState
    }

    get incidenceCity() {
        return this.props.incidenceCity
    }

    get serviceState() {
        return this.props.serviceState
    }

    get serviceCity() {
        return this.props.serviceCity
    }

    // Control getters
    get status() {
        return this.props.status
    }

    get batchNumber() {
        return this.props.batchNumber
    }

    get protocol() {
        return this.props.protocol
    }

    get nfseNumber() {
        return this.props.nfseNumber
    }

    get substituteNfseNumber() {
        return this.props.substituteNfseNumber
    }

    get substituteReason() {
        return this.props.substituteReason
    }

    get cancelReason() {
        return this.props.cancelReason
    }

    // File getters
    get pdfFileId() {
        return this.props.pdfFileId
    }

    get xmlFileId() {
        return this.props.xmlFileId
    }

    // Timestamp getters
    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    get canceledAt() {
        return this.props.canceledAt
    }

    // Collection getters
    get events() {
        return this.props.events
    }

    // RPS Setters
    set rpsNumber(rpsNumber: string) {
        this.props.rpsNumber = rpsNumber
        this.touch()
    }

    set rpsSeries(rpsSeries: string) {
        this.props.rpsSeries = rpsSeries
        this.touch()
    }

    set rpsType(rpsType: RpsType) {
        this.props.rpsType = rpsType
        this.touch()
    }

    // Dates Setters
    set issueDate(issueDate: Date) {
        this.props.issueDate = issueDate
        this.touch()
    }

    set competenceDate(competenceDate: Date) {
        this.props.competenceDate = competenceDate
        this.touch()
    }

    // Service Description Setters
    set description(description: string) {
        this.props.description = description
        this.touch()
    }

    set additionalInformation(additionalInformation: string | null | undefined) {
        this.props.additionalInformation = additionalInformation
        this.touch()
    }

    set operationType(operationType: OperationType) {
        this.props.operationType = operationType
        this.touch()
    }

    set serviceCode(serviceCode: ServiceCode) {
        this.props.serviceCode = serviceCode
        this.touch()
    }

    set issRequirement(issRequirement: IssRequirement) {
        this.props.issRequirement = issRequirement
        this.touch()
    }

    set cnaeCode(cnaeCode: string) {
        this.props.cnaeCode = cnaeCode
        this.touch()
    }

    set cityTaxCode(cityTaxCode: string | null | undefined) {
        this.props.cityTaxCode = cityTaxCode
        this.touch()
    }

    set issRetention(issRetention: boolean) {
        this.props.issRetention = issRetention
        this.touch()
    }

    // Values Setters
    set serviceAmount(serviceAmount: number) {
        this.props.serviceAmount = serviceAmount
        this.touch()
    }

    set unconditionalDiscount(unconditionalDiscount: number) {
        this.props.unconditionalDiscount = unconditionalDiscount
        this.touch()
    }

    set conditionalDiscount(conditionalDiscount: number) {
        this.props.conditionalDiscount = conditionalDiscount
        this.touch()
    }

    set calculationBase(calculationBase: number) {
        this.props.calculationBase = calculationBase
        this.touch()
    }

    set netAmount(netAmount: number) {
        this.props.netAmount = netAmount
        this.touch()
    }

    // Tax Rates Setters
    set issRate(issRate: number) {
        this.props.issRate = issRate
        this.touch()
    }

    set pisRate(pisRate: number) {
        this.props.pisRate = pisRate
        this.touch()
    }

    set cofinsRate(cofinsRate: number) {
        this.props.cofinsRate = cofinsRate
        this.touch()
    }

    set irRate(irRate: number) {
        this.props.irRate = irRate
        this.touch()
    }

    set inssRate(inssRate: number) {
        this.props.inssRate = inssRate
        this.touch()
    }

    set csllRate(csllRate: number) {
        this.props.csllRate = csllRate
        this.touch()
    }

    // Tax Amounts Setters
    set issAmount(issAmount: number) {
        this.props.issAmount = issAmount
        this.touch()
    }

    set pisAmount(pisAmount: number) {
        this.props.pisAmount = pisAmount
        this.touch()
    }

    set cofinsAmount(cofinsAmount: number) {
        this.props.cofinsAmount = cofinsAmount
        this.touch()
    }

    set inssAmount(inssAmount: number) {
        this.props.inssAmount = inssAmount
        this.touch()
    }

    set irAmount(irAmount: number) {
        this.props.irAmount = irAmount
        this.touch()
    }

    set csllAmount(csllAmount: number) {
        this.props.csllAmount = csllAmount
        this.touch()
    }

    set otherRetentions(otherRetentions: number) {
        this.props.otherRetentions = otherRetentions
        this.touch()
    }

    // Location Setters
    set incidenceState(incidenceState: string) {
        this.props.incidenceState = incidenceState
        this.touch()
    }

    set incidenceCity(incidenceCity: string) {
        this.props.incidenceCity = incidenceCity
        this.touch()
    }

    set serviceState(serviceState: string) {
        this.props.serviceState = serviceState
        this.touch()
    }

    set serviceCity(serviceCity: string) {
        this.props.serviceCity = serviceCity
        this.touch()
    }

    // Setters with touch
    set status(status: NfseStatus) {
        this.props.status = status
        this.touch()
    }

    set protocol(protocol: string | null | undefined) {
        this.props.protocol = protocol
        this.touch()
    }

    set nfseNumber(nfseNumber: string | null | undefined) {
        this.props.nfseNumber = nfseNumber
        this.touch()
    }

    set pdfFileId(pdfFileId: string | null | undefined) {
        this.props.pdfFileId = pdfFileId
        this.touch()
    }

    set xmlFileId(xmlFileId: string | null | undefined) {
        this.props.xmlFileId = xmlFileId
        this.touch()
    }

    set canceledAt(canceledAt: Date | null | undefined) {
        this.props.canceledAt = canceledAt
        this.touch()
    }

    // Event management
    addEvent(event: NfseEvent) {
        this.props.events.push(event)
        this.touch()
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

    // Status management methods
    cancel(reason: NfseCancelReason) {
        this.status = NfseStatus.CANCELED
        this.props.cancelReason = reason
        this.props.canceledAt = new Date()
        this.touch()
    }

    substitute(newNfseNumber: string, reason: string) {
        this.status = NfseStatus.REPLACED
        this.props.substituteNfseNumber = newNfseNumber
        this.props.substituteReason = reason
        this.touch()
    }

    static create(
        props: Optional<
            NfseProps,
            | 'createdAt'
            | 'events'
            | 'unconditionalDiscount'
            | 'conditionalDiscount'
            | 'additionalInformation'
            | 'cityTaxCode'
            | 'batchNumber'
            | 'protocol'
            | 'nfseNumber'
            | 'substituteNfseNumber'
            | 'substituteReason'
            | 'cancelReason'
            | 'pdfFileId'
            | 'xmlFileId'
            | 'canceledAt'
            | 'updatedAt'
            | 'pisRate'
            | 'cofinsRate'
            | 'irRate'
            | 'inssRate'
            | 'csllRate'
            | 'pisAmount'
            | 'cofinsAmount'
            | 'inssAmount'
            | 'irAmount'
            | 'csllAmount'
            | 'otherRetentions'
        >,
        id?: UniqueEntityID,
    ) {
        const nfse = new Nfse(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
                events: props.events ?? [],
                unconditionalDiscount: props.unconditionalDiscount ?? 0,
                conditionalDiscount: props.conditionalDiscount ?? 0,
                pisRate: props.pisRate ?? 0,
                cofinsRate: props.cofinsRate ?? 0,
                irRate: props.irRate ?? 0,
                inssRate: props.inssRate ?? 0,
                csllRate: props.csllRate ?? 0,
                pisAmount: props.pisAmount ?? 0,
                cofinsAmount: props.cofinsAmount ?? 0,
                inssAmount: props.inssAmount ?? 0,
                irAmount: props.irAmount ?? 0,
                csllAmount: props.csllAmount ?? 0,
                otherRetentions: props.otherRetentions ?? 0,
            },
            id,
        )

        return nfse
    }
}