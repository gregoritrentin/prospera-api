import { Person as PrismaPerson, Business as PrismaBusiness } from '@prisma/client'
import { PersonDetails } from '@/domain/person/entities/value-objects/person-details'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type PrismaPersontBusiness = PrismaPerson & {
    business: PrismaBusiness
}

export class PrismaPersonDetailsMapper {
    static toDomain(raw: PrismaPersontBusiness): PersonDetails {
        return PersonDetails.create({

            businessId: new UniqueEntityID(raw.business.id),
            businessName: raw.business.name,
            personId: new UniqueEntityID(raw.id),
            personName: raw.name,
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
            notes: raw.notes,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        })
    }
}