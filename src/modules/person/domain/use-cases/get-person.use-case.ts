import { PersonsRepository } from '@/modules/pers/domain/repositori/persons-repository'
import { Injectable } from '@nestjs/common'
import { Person } from '@/core/domain/entities/person.entity'

import { Either, left, right } from @core/co@core/either'
import { AppError } from @core/co@core/erro@core/app-errors'

interface GetPersonUseCaseRequest {
    businessId: string
    personId: string
}

type GetPersonUseCaseResponse = Either<
    AppError,
    {
        person: Person
    }
>

@Injectable()
export class GetPersonUseCase {
    constructor(private personsRepository: PersonsRepository) { }

    async execute({
        businessId,
        personId,
    }: GetPersonUseCaseRequest): Promise<GetPersonUseCaseResponse> {
        const person = await this.personsRepository.findById(personId, businessId)

        if (!person) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (businessId !== person.businessId.toString()) {
            return left(AppError.notAllowed('errors.RESOURCE_NOT_ALLOWED'))
        }

        return right({
            person
        })
    }
}