import { UniqueEntityID } from '@/core/domain/entity/unique-entity-id'
import { Nfse } from '@/modules/dfe/domain/nfse/entities/nfse'
import { NfseEvent } from '@/modules/dfe/domain/nfse/entities/nfse-event'
import {
    Nfse as PrismaNfse,
    NfseEvent as PrismaNfseEvent,
    Business,
    Person,
    City,
    State,
    File,
    Prisma
} from '@prisma/client'
import {
    RpsType,
    NfseStatus,
    OperationType,
    IssRequirement,
    ServiceCode,
    NfseEventType,
    NfseEventStatus,
    NfseSubstituteReason,
    NfseCancelReason
} from '@/core/utils/enums'

export class PrismaNfseMapper {
    static toDomain(raw: PrismaNfse & {
        NfseEvent?: PrismaNfseEvent[]
        incidenceCityCode?: City
        incidenceStateCode?: State
        serviceCityCode?: City
        serviceStateCode?: State
        pdfFile?: File | null
        xmlFile?: File | null
    }): Nfse {
        return Nfse.create(
            {
                businessId: new UniqueEntityID(raw.businessId),
                personId: new UniqueEntityID(raw.personId),
                rpsNumber: raw.rpsNumber,
                rpsSeries: raw.rpsSeries,
                rpsType: raw.rpsType as RpsType,
                issueDate: raw.issueDate,
                competenceDate: raw.competenceDate,
                description: raw.description,
                additionalInformation: raw.additionalInformation,
                operationType: raw.operationType as OperationType,
                serviceCode: raw.serviceCode as ServiceCode,
                issRequirement: raw.issRequirement as IssRequirement,
                cnaeCode: raw.cnaeCode,
                cityTaxCode: raw.cityTaxCode,
                issRetention: raw.issRetention,

                // Values
                serviceAmount: raw.serviceAmount.toNumber(),
                unconditionalDiscount: raw.unconditionalDiscount.toNumber(),
                conditionalDiscount: raw.conditionalDiscount.toNumber(),
                calculationBase: raw.calculationBase.toNumber(),
                netAmount: raw.netAmount.toNumber(),

                // Tax rates
                issRate: raw.issRate.toNumber(),
                pisRate: raw.pisRate.toNumber(),
                cofinsRate: raw.cofinsRate.toNumber(),
                irRate: raw.irRate.toNumber(),
                inssRate: raw.inssRate.toNumber(),
                csllRate: raw.csllRate.toNumber(),

                // Tax amounts
                issAmount: raw.issAmount.toNumber(),
                pisAmount: raw.pisAmount.toNumber(),
                cofinsAmount: raw.cofinsAmount.toNumber(),
                inssAmount: raw.inssAmount.toNumber(),
                irAmount: raw.irAmount.toNumber(),
                csllAmount: raw.csllAmount.toNumber(),
                otherRetentions: raw.otherRetentions.toNumber(),

                // Location
                incidenceState: raw.incidenceState,
                incidenceCity: raw.incidenceCity,
                serviceState: raw.serviceState,
                serviceCity: raw.serviceCity,

                // Control
                status: raw.status as NfseStatus,
                batchNumber: raw.batchNumber,
                protocol: raw.protocol,
                nfseNumber: raw.nfseNumber,
                substituteNfseNumber: raw.substituteNfseNumber,
                substituteReason: raw.substituteReason as NfseSubstituteReason,
                cancelReason: raw.cancelReason as NfseCancelReason,

                // Files
                pdfFileId: raw.pdfFileId,
                xmlFileId: raw.xmlFileId,

                // Events
                events: raw.NfseEvent?.map(event => NfseEvent.create(
                    {
                        nfseId: new UniqueEntityID(raw.id),
                        type: event.type as NfseEventType,
                        status: event.status as NfseEventStatus,
                        message: event.message,
                        requestXml: event.requestXml,
                        responseXml: event.responseXml,
                        returnMessage: event.returnMessage,
                        payload: event.payload as Record<string, any>,
                        createdAt: event.createdAt,
                        updatedAt: event.updatedAt
                    },
                    new UniqueEntityID(event.id)
                )) || [],

                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
                canceledAt: raw.canceledAt
            },
            new UniqueEntityID(raw.id)
        )
    }

    static toPrisma(nfse: Nfse) {
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
            additionalInformation: nfse.additionalInformation ?? '',
            operationType: nfse.operationType,
            serviceCode: nfse.serviceCode,
            issRequirement: nfse.issRequirement,
            cnaeCode: nfse.cnaeCode,
            cityTaxCode: nfse.cityTaxCode,
            issRetention: nfse.issRetention,

            // Values
            serviceAmount: nfse.serviceAmount as unknown as Prisma.Decimal,
            unconditionalDiscount: nfse.unconditionalDiscount as unknown as Prisma.Decimal,
            conditionalDiscount: nfse.conditionalDiscount as unknown as Prisma.Decimal,
            calculationBase: nfse.calculationBase as unknown as Prisma.Decimal,
            netAmount: nfse.netAmount as unknown as Prisma.Decimal,

            // Tax rates
            issRate: nfse.issRate as unknown as Prisma.Decimal,
            pisRate: nfse.pisRate as unknown as Prisma.Decimal,
            cofinsRate: nfse.cofinsRate as unknown as Prisma.Decimal,
            irRate: nfse.irRate as unknown as Prisma.Decimal,
            inssRate: nfse.inssRate as unknown as Prisma.Decimal,
            csllRate: nfse.csllRate as unknown as Prisma.Decimal,

            // Tax amounts
            issAmount: nfse.issAmount as unknown as Prisma.Decimal,
            pisAmount: nfse.pisAmount as unknown as Prisma.Decimal,
            cofinsAmount: nfse.cofinsAmount as unknown as Prisma.Decimal,
            inssAmount: nfse.inssAmount as unknown as Prisma.Decimal,
            irAmount: nfse.irAmount as unknown as Prisma.Decimal,
            csllAmount: nfse.csllAmount as unknown as Prisma.Decimal,
            otherRetentions: nfse.otherRetentions as unknown as Prisma.Decimal,

            // Location
            incidenceState: nfse.incidenceState,
            incidenceCity: nfse.incidenceCity,
            serviceState: nfse.serviceState,
            serviceCity: nfse.serviceCity,

            // Control
            status: nfse.status,
            batchNumber: nfse.batchNumber,
            protocol: nfse.protocol,
            nfseNumber: nfse.nfseNumber,
            substituteNfseNumber: nfse.substituteNfseNumber,
            substituteReason: nfse.substituteReason as NfseSubstituteReason,
            cancelReason: nfse.cancelReason as NfseCancelReason,

            // Files
            pdfFileId: nfse.pdfFileId,
            xmlFileId: nfse.xmlFileId,

            // Events
            NfseEvent: {
                createMany: {
                    data: nfse.events.map(event => ({
                        id: event.id.toString(),
                        type: event.type,
                        status: event.status,
                        message: event.message,
                        requestXml: event.requestXml,
                        responseXml: event.responseXml,
                        returnMessage: event.returnMessage,
                        payload: event.payload ?? Prisma.JsonNull,
                        createdAt: event.createdAt,
                        updatedAt: event.updatedAt
                    }))
                }
            },

            // Timestamps
            createdAt: nfse.createdAt,
            updatedAt: nfse.updatedAt,
            canceledAt: nfse.canceledAt
        }
    }


}