import {
    Nfse as PrismaNfse,
    Business as PrismaBusiness,
    Person as PrismaPerson,
    NfseEvent as PrismaNfseEvent,
    City as PrismaCity,
    State as PrismaState,
    File as PrismaFile
} from '@prisma/client'
import { NfseDetails } from '@/domain/dfe/nfse/entities/value-objects/nfse-details'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
    RpsType,
    NfseStatus,
    OperationType,
    IssRequirement,
    ServiceCode,
    NfseSubstituteReason,
    NfseCancelReason
} from '@/core/types/enums'

type PrismaNfseWithRelations = Omit<PrismaNfse, 'business'> & {
    business: Omit<PrismaBusiness, 'im'> & {
        im: string | null
    }
    person: PrismaPerson
    NfseEvent: PrismaNfseEvent[]
    incidenceCityCode: PrismaCity
    incidenceStateCode: PrismaState
    serviceCityCode: PrismaCity
    serviceStateCode: PrismaState
    pdfFile?: PrismaFile | null
    xmlFile?: PrismaFile | null
}

export class PrismaNfseDetailsMapper {
    static toDomain(raw: PrismaNfseWithRelations): NfseDetails {
        return NfseDetails.create({
            businessId: new UniqueEntityID(raw.businessId),
            businessName: raw.business.name,
            businessDocument: raw.business.document,
            businessCityCode: raw.business.cityCode,
            businessInscricaoMunicipal: raw.business.im ?? '',

            personId: new UniqueEntityID(raw.personId),
            personName: raw.person.name,
            personDocument: raw.person.document,
            personEmail: raw.person.email,
            personPhone: raw.person.phone,

            rpsNumber: raw.rpsNumber,
            rpsSeries: raw.rpsSeries,
            rpsType: raw.rpsType as RpsType,
            issueDate: raw.issueDate,
            competenceDate: raw.competenceDate,

            description: raw.description,
            additionalInformation: raw.additionalInformation,
            operationType: raw.operationType as OperationType,
            serviceCode: raw.serviceCode as ServiceCode,
            serviceName: 'TODO: Add service name lookup',
            issRequirement: raw.issRequirement as IssRequirement,
            cnaeCode: raw.cnaeCode,
            cityTaxCode: raw.cityTaxCode,
            issRetention: raw.issRetention,

            serviceAmount: raw.serviceAmount.toNumber(),
            unconditionalDiscount: raw.unconditionalDiscount.toNumber(),
            conditionalDiscount: raw.conditionalDiscount.toNumber(),
            calculationBase: raw.calculationBase.toNumber(),
            netAmount: raw.netAmount.toNumber(),

            issRate: raw.issRate.toNumber(),
            pisRate: raw.pisRate.toNumber(),
            cofinsRate: raw.cofinsRate.toNumber(),
            irRate: raw.irRate.toNumber(),
            inssRate: raw.inssRate.toNumber(),
            csllRate: raw.csllRate.toNumber(),

            issAmount: raw.issAmount.toNumber(),
            pisAmount: raw.pisAmount.toNumber(),
            cofinsAmount: raw.cofinsAmount.toNumber(),
            inssAmount: raw.inssAmount.toNumber(),
            irAmount: raw.irAmount.toNumber(),
            csllAmount: raw.csllAmount.toNumber(),
            otherRetentions: raw.otherRetentions.toNumber(),

            incidenceState: raw.incidenceState,
            incidenceCity: raw.incidenceCity,
            serviceState: raw.serviceState,
            serviceCity: raw.serviceCity,

            status: raw.status as NfseStatus,
            batchNumber: raw.batchNumber,
            protocol: raw.protocol,
            nfseNumber: raw.nfseNumber,
            substituteNfseNumber: raw.substituteNfseNumber,
            substituteReason: raw.substituteReason as NfseSubstituteReason || undefined,
            cancelReason: raw.cancelReason as NfseCancelReason || undefined,

            pdfFileId: raw.pdfFileId,
            xmlFileId: raw.xmlFileId,

            eventsCount: raw.NfseEvent.length,
            eventsDetails: raw.NfseEvent.map(event => ({
                id: event.id,
                type: event.type,
                status: event.status,
                message: event.message ?? undefined,
                createdAt: event.createdAt
            })),

            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            canceledAt: raw.canceledAt,
        })
    }
}