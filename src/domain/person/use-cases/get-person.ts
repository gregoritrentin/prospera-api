import { Either, left, right } from '@/core/either'
import { PersonRepository } from '@/domain/person/repositories/person-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { PersonDetails } from '../entities/value-objects/person-details'
import { Person } from '../entities/person'

interface GetPersonUseCaseRequest {
    businessId: string
    personId: string
}

type GetPersonUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        person: Person
    }
>

@Injectable()
export class GetPersonUseCase {
    constructor(private personRepository: PersonRepository) { }

    async execute({
        businessId,
        personId,
    }: GetPersonUseCaseRequest): Promise<GetPersonUseCaseResponse> {
        const person = await this.personRepository.findById(personId, businessId)

        if (!person) {
            return left(new ResourceNotFoundError())
        }

        if (businessId !== person.businessId.toString()) {
            return left(new NotAllowedError())
        }

        return right({
            person
        })
    }
}
