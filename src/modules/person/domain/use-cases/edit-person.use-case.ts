import { Person } from '@/modules/pers/domain/entiti/person'
import { PersonsRepository } from '@/modules/pers/domain/repositori/persons-repository'
import { Injectable } from '@nestjs/common'

import { Either, left, right } from @core/co@core/either'
import { AppError } from @core/co@core/erro@core/app-errors'
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
    stateCode: string
    cityCode: string
    status: string
    notes?: string | null
}

type EditPersonUseCaseResponse = Either<
    AppError,
    {
        person: Person
    }
>

@Injectable()
export class EditPersonUseCase {
    constructor(
        private personsRepository: PersonsRepository,
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
        stateCode,
        cityCode,
        status,
        notes,

    }: EditPersonUseCaseRequest): Promise<EditPersonUseCaseResponse> {
        const person = await this.personsRepository.findById(personId, businessId)

        if (!person) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (businessId !== person.businessId.toString()) {
            return left(AppError.notAllowed('errors.RESOURCE_NOT_ALLOWED'))
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
        person.stateCode = stateCode
        person.cityCode = cityCode
        person.status = status
        person.notes = notes

        await this.personsRepository.save(person)

        return right({
            person,
        })
    }
}