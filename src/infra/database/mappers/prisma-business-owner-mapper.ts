import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { BusinessOwner } from '@/domain/business/entities/business-owner'
import { BusinessOwners as PrismaBusinessOwner, Prisma } from '@prisma/client'

export class PrismaBusinessOwnerMapper {
    static toDomain(raw: PrismaBusinessOwner): BusinessOwner {
        return BusinessOwner.create({
            businessId: new UniqueEntityID(raw.businessId),
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
            state: raw.state,
            city: raw.city,
            status: raw.status,
            ownerType: raw.ownerType,
            createdAt: raw.createdAt,
            updatedAt: raw.updateAt,
        },
            new UniqueEntityID(raw.id),
        )
    }

    static toPrisma(businessOwner: BusinessOwner): Prisma.BusinessOwnersUncheckedCreateInput {
        return {
            id: businessOwner.id.toString(),
            businessId: businessOwner.businessId.toString(),
            name: businessOwner.name,
            email: businessOwner.email,
            phone: businessOwner.phone,
            document: businessOwner.document,
            addressLine1: businessOwner.addressLine1,
            addressLine2: businessOwner.addressLine2,
            addressLine3: businessOwner.addressLine3,
            neighborhood: businessOwner.neighborhood,
            postalCode: businessOwner.postalCode,
            countryCode: businessOwner.countryCode,
            state: businessOwner.state,
            city: businessOwner.city,
            status: businessOwner.status,
            ownerType: businessOwner.ownerType,
            createdAt: businessOwner.createdAt,
            updateAt: businessOwner.updatedAt,
        }
    }
}