import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Business } from '@/domain/core/entities/business'
import { Business as PrismaBusiness, Prisma } from '@prisma/client'

export class PrismaBusinessMapper {
    static toDomain(raw: PrismaBusiness): Business {
        return Business.create({

            marketplaceId: new UniqueEntityID(raw.marketplaceId),
            name: raw.name,
            email: raw.email,
            phone: raw.phone,
            document: raw.document,
            addressLine1: raw.addressLine1,
            addressLine2: raw.addressLine2,
            addressLine3: raw.addressLine3,
            neighborhood: raw.neighborhood,
            postalCode: raw.postalCode,
            countryCode: raw.countryCode,
            stateCode: raw.stateCode,
            cityCode: raw.cityCode,
            status: raw.status,
            businessSize: raw.businessSize,
            businessType: raw.businessType,
            //foundingDate: raw.foundingDate,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        },
            new UniqueEntityID(raw.id),
        )
    }

    static toPrisma(business: Business): Prisma.BusinessUncheckedCreateInput {
        return {
            id: business.id.toString(),
            marketplaceId: business.marketplaceId.toString(),
            name: business.name,
            email: business.email,
            phone: business.phone,
            document: business.document,
            addressLine1: business.addressLine1,
            addressLine2: business.addressLine2,
            addressLine3: business.addressLine3,
            neighborhood: business.neighborhood,
            postalCode: business.postalCode,
            countryCode: business.countryCode,
            stateCode: business.stateCode,
            cityCode: business.cityCode,
            status: business.status,
            businessSize: business.businessSize,
            businessType: business.businessType,
            //foundingDate: business.foundingDate,
            createdAt: business.createdAt,
            updatedAt: business.updatedAt,
        }
    }
}