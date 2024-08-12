import { Either, left, right } from '@/core/either'
import { PersonRepository } from '@/domain/person/repositories/person-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeletePersonUseCaseRequest {
    businessId: string
    personId: string
}

type DeletePersonUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    null
>

@Injectable()
export class DeletePersonUseCase {
    constructor(private personRepository: PersonRepository) { }

    async execute({
        businessId,
        personId,
    }: DeletePersonUseCaseRequest): Promise<DeletePersonUseCaseResponse> {
        const person = await this.personRepository.findById(personId, businessId)

        if (!person) {
            return left(new ResourceNotFoundError())
        }

        if (businessId !== person.businessId.toString()) {
            return left(new NotAllowedError())
        }

        await this.personRepository.delete(person)

        return right(null)
    }
}
