import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Person } from '@/domain/person/entities/person'
import { Person as PrismaPerson, Prisma } from '@prisma/client'

export class PrismaPersonMapper {
    static toDomain(raw: PrismaPerson): Person {
        return Person.create({
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
            notes: raw.notes,
            createdAt: raw.createdAt,
            updatedAt: raw.updateAt

        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(person: Person): Prisma.PersonUncheckedCreateInput {
        return {
            id: person.id.toString(),
            businessId: person.businessId.toString(),
            name: person.name,
            email: person.email,
            phone: person.phone,
            document: person.document,
            addressLine1: person.addressLine1,
            addressLine2: person.addressLine2,
            addressLine3: person.addressLine3,
            neighborhood: person.neighborhood,
            postalCode: person.postalCode,
            countryCode: person.countryCode,
            state: person.state,
            city: person.city,
            status: person.status,
            notes: person.notes,
            createdAt: person.createdAt,
            updateAt: person.updatedAt
        }
    }
}