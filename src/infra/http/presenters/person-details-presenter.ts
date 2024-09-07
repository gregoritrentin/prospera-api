//import { Person } from "@/domain/person/entities/person";
import { PersonDetails } from '@/domain/person/entities/value-objects/person-details'
export class PersonDetailsPresenter {
    static toHttp(personDetails: PersonDetails) {
        return {

            businessId: personDetails.businessId.toString(),
            businessName: personDetails.businessName,
            personId: personDetails.personId.toString(),
            personName: personDetails.personName,
            document: personDetails.document,
            addressLine1: personDetails.addressLine1,
            addressLine2: personDetails.addressLine2,
            addressLine3: personDetails.addressLine3,
            neighborhood: personDetails.neighborhood,
            postalCode: personDetails.postalCode,
            countryCode: personDetails.countryCode,
            stateCode: personDetails.stateCode,
            cityCode: personDetails.cityCode,
            status: personDetails.status,
            notes: personDetails.notes,
            createdAt: personDetails.createdAt,
            updatedAt: personDetails.updatedAt
        }
    }
}