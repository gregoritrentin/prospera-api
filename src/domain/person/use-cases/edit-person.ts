import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Person } from '@/domain/person/entities/person'
import { PersonRepository } from '@/domain/person/repositories/person-repository'
import { Injectable } from '@nestjs/common'

interface EditPersonUseCaseRequest {
    businessId: string
    personId: string
    name: string
    phone: string
    email: string
    document: string
    addressLine1: string
    addressLine2: string
    addressLine3?: string | null
    neighborhood: string
    postalCode: string
    countryCode: string
    state: string
    city: string
    status: string
    notes?: string | null
}

type EditPersonUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        person: Person
    }
>

@Injectable()
export class EditPersonUseCase {
    constructor(
        private personRepository: PersonRepository,
    ) { }

    async execute({
        businessId,
        personId,
        name,
        phone,
        email,
        document,
        addressLine1,
        addressLine2,
        addressLine3,
        neighborhood,
        postalCode,
        countryCode,
        state,
        city,
        status,
        notes,

    }: EditPersonUseCaseRequest): Promise<EditPersonUseCaseResponse> {
        const person = await this.personRepository.findById(personId, businessId)

        if (!person) {
            return left(new ResourceNotFoundError())
        }

        if (businessId !== person.businessId.toString()) {
            return left(new NotAllowedError())
        }

        person.name = name
        person.phone = phone
        person.email = email
        person.document = document
        person.addressLine1 = addressLine1
        person.addressLine2 = addressLine2
        person.addressLine3 = addressLine3
        person.neighborhood = neighborhood
        person.postalCode = postalCode
        person.countryCode = countryCode
        person.state = state
        person.city = city
        person.status = status
        person.notes = notes

        await this.personRepository.save(person)

        return right({
            person,
        })
    }
}
