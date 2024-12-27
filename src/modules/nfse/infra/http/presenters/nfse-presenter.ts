import { Nfse } from '@/domain/dfe/nfse/entities/nfse'
import { NfseEvent } from '@/domain/dfe/nfse/entities/nfse-event'
import { NfseDetails, NfseEventSummary } from '@/domain/dfe/nfse/entities/value-objects/nfse-details'

interface NfseDetailsPresenterOutput {
    // Basic info
    businessId: string
    businessName: string
    businessDocument: string
    businessCityCode: string
    businessInscricaoMunicipal: string

    personId: string
    personName: string
    personDocument: string
    personEmail?: string | null
    personPhone?: string | null

    // RPS info
    rpsNumber: string
    rpsSeries: string
    rpsType: string

    // Dates
    issueDate: Date
    competenceDate: Date

    // Service
    description: string
    additionalInformation?: string | null
    operationType: string
    serviceCode: string
    serviceName: string
    issRequirement: string

    // Values
    serviceAmount: number
    unconditionalDiscount: number
    conditionalDiscount: number
    calculationBase: number
    netAmount: number

    // Tax rates
    issRate: number
    pisRate: number
    cofinsRate: number

    // Tax amounts
    issAmount: number
    pisAmount: number
    cofinsAmount: number

    // Control
    status: string
    nfseNumber: string | null | undefined
    protocol: string | null | undefined

    // Events
    eventsCount: number
    eventsDetails: NfseEventSummary[]

    // Timestamps
    createdAt: Date
    updatedAt?: Date | null
    canceledAt?: Date | null

    // Computed properties
    totalTaxAmount: number
    isAuthorized: boolean
    isCanceled: boolean
    hasErrors: boolean
    formattedStatus: string
    hasEvents: boolean
}

export class NfseEventPresenter {
    static toHttp(event: NfseEvent) {
        return {
            id: event.id.toString(),
            nfseId: event.nfseId.toString(),
            type: event.type,
            status: event.status,
            message: event.message,
            requestXml: event.requestXml,
            responseXml: event.responseXml,
            returnMessage: event.returnMessage,
            payload: event.payload,
            createdAt: event.createdAt,
            updatedAt: event.updatedAt
        }
    }
}

export class NfseDetailsPresenter {
    static toHttp(details: NfseDetails): NfseDetailsPresenterOutput {
        return {
            // Basic info
            businessId: details.businessId.toString(),
            businessName: details.businessName,
            businessDocument: details.businessDocument,
            businessCityCode: details.businessCityCode,
            businessInscricaoMunicipal: details.businessInscricaoMunicipal,

            personId: details.personId.toString(),
            personName: details.personName,
            personDocument: details.personDocument,
            personEmail: details.personEmail,
            personPhone: details.personPhone,

            // RPS info
            rpsNumber: details.rpsNumber,
            rpsSeries: details.rpsSeries,
            rpsType: details.rpsType,

            // Dates
            issueDate: details.issueDate,
            competenceDate: details.competenceDate,

            // Service
            description: details.description,
            additionalInformation: details.additionalInformation,
            operationType: details.operationType,
            serviceCode: details.serviceCode,
            serviceName: details.serviceName,
            issRequirement: details.issRequirement,

            // Values
            serviceAmount: details.serviceAmount,
            unconditionalDiscount: details.unconditionalDiscount,
            conditionalDiscount: details.conditionalDiscount,
            calculationBase: details.calculationBase,
            netAmount: details.netAmount,

            // Tax rates
            issRate: details.issRate,
            pisRate: details.pisRate,
            cofinsRate: details.cofinsRate,

            // Tax amounts
            issAmount: details.issAmount,
            pisAmount: details.pisAmount,
            cofinsAmount: details.cofinsAmount,

            // Control
            status: details.status,
            nfseNumber: details.nfseNumber,
            protocol: details.protocol,

            // Events
            eventsCount: details.eventsCount,
            eventsDetails: details.eventsDetails,

            // Timestamps
            createdAt: details.createdAt,
            updatedAt: details.updatedAt,
            canceledAt: details.canceledAt,

            // Computed properties
            totalTaxAmount: details.totalTaxAmount,
            isAuthorized: details.isAuthorized,
            isCanceled: details.isCanceled,
            hasErrors: details.hasErrors,
            formattedStatus: details.formattedStatus,
            hasEvents: details.hasEvents
        }
    }
}

export class NfsePresenter {
    static toHttp(nfse: Nfse) {
        return {
            id: nfse.id.toString(),
            businessId: nfse.businessId.toString(),
            personId: nfse.personId.toString(),

            rpsNumber: nfse.rpsNumber,
            rpsSeries: nfse.rpsSeries,
            rpsType: nfse.rpsType,

            issueDate: nfse.issueDate,
            competenceDate: nfse.competenceDate,

            description: nfse.description,
            additionalInformation: nfse.additionalInformation,
            operationType: nfse.operationType,
            serviceCode: nfse.serviceCode,
            issRequirement: nfse.issRequirement,
            cnaeCode: nfse.cnaeCode,
            cityTaxCode: nfse.cityTaxCode,
            issRetention: nfse.issRetention,

            serviceAmount: nfse.serviceAmount,
            unconditionalDiscount: nfse.unconditionalDiscount,
            conditionalDiscount: nfse.conditionalDiscount,
            calculationBase: nfse.calculationBase,
            netAmount: nfse.netAmount,

            issRate: nfse.issRate,
            pisRate: nfse.pisRate,
            cofinsRate: nfse.cofinsRate,
            irRate: nfse.irRate,
            inssRate: nfse.inssRate,
            csllRate: nfse.csllRate,

            issAmount: nfse.issAmount,
            pisAmount: nfse.pisAmount,
            cofinsAmount: nfse.cofinsAmount,
            inssAmount: nfse.inssAmount,
            irAmount: nfse.irAmount,
            csllAmount: nfse.csllAmount,
            otherRetentions: nfse.otherRetentions,

            incidenceState: nfse.incidenceState,
            incidenceCity: nfse.incidenceCity,
            serviceState: nfse.serviceState,
            serviceCity: nfse.serviceCity,

            status: nfse.status,
            batchNumber: nfse.batchNumber,
            protocol: nfse.protocol,
            nfseNumber: nfse.nfseNumber,

            substituteNfseNumber: nfse.substituteNfseNumber,
            substituteReason: nfse.substituteReason,
            cancelReason: nfse.cancelReason,

            pdfFileId: nfse.pdfFileId,
            xmlFileId: nfse.xmlFileId,

            createdAt: nfse.createdAt,
            updatedAt: nfse.updatedAt,
            canceledAt: nfse.canceledAt,

            events: nfse.events.map(NfseEventPresenter.toHttp)
        }
    }
}