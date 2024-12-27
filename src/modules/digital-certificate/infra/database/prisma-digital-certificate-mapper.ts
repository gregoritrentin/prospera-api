// src/infra/database/prisma/mappers/prisma-digital-certificate-mapper.ts
import { DigitalCertificate, CertificateSource, CertificateStatus } from '@/domain/digital-certificate/entities/digital-certificate'
import { UniqueEntityID } from '@core/domain/entity/unique-entity-id'
import { Prisma, DigitalCertificate as PrismaDigitalCertificate } from '@prisma/client'

export class PrismaDigitalCertificateMapper {
    static toPrisma(
        certificate: DigitalCertificate,
    ): Prisma.DigitalCertificateUncheckedCreateInput {
        return {
            id: certificate.id.toString(),
            businessId: certificate.businessId.toString(),
            certificateFileId: certificate.certificateFileId.toString(),
            source: certificate.source,
            serialNumber: certificate.serialNumber,
            thumbprint: certificate.thumbprint,
            password: certificate.password, // Assumindo que a encriptação é feita em outro lugar
            issueDate: certificate.issueDate,
            expirationDate: certificate.expirationDate,
            installationDate: certificate.installationDate,
            status: certificate.status,
            createdAt: certificate.createdAt,
            updatedAt: certificate.updatedAt,
        }
    }

    static toDomain(raw: PrismaDigitalCertificate & {
        certificateFile?: any
        business?: any
    }): DigitalCertificate {
        return DigitalCertificate.create(
            {
                businessId: new UniqueEntityID(raw.businessId),
                certificateFileId: new UniqueEntityID(raw.certificateFileId),
                source: raw.source as CertificateSource,
                serialNumber: raw.serialNumber,
                thumbprint: raw.thumbprint,
                password: raw.password,
                issueDate: raw.issueDate,
                expirationDate: raw.expirationDate,
                installationDate: raw.installationDate,
                status: raw.status as CertificateStatus,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new UniqueEntityID(raw.id),
        )
    }
}