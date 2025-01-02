import { Person } from "@/modules/person/domain/entities/person"

export class PersonPresenter {
    static toHttp(person: Person) {
        return {
            id: person.id.toString(),
            businessId: person.businessId.toString(),
            name: person.name,
            phone: person.phone,
            email: person.email,
            document: person.document,
            addressLine1: person.addressLine1,
            addressLine2: person.addressLine2,
            addressLine3: person.addressLine3,
            neighborhood: person.neighborhood,
            postalCode: person.postalCode,
            countryCode: person.countryCode,
            stateCode: person.stateCode,
            cityCode: person.cityCode,
            status: person.status,
            createdAt: person.createdAt,
            updatedAt: person.updatedAt
        }
    }
}