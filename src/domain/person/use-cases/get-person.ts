import { Either, left, right } from '@/core/either'
import { PersonsRepository } from '@/domain/person/repositories/persons-repository'
import { Injectable } from '@nestjs/common'
import { Person } from '../entities/person'
import { AppError } from '@/core/errors/app-errors'

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
