import { PersonsRepository } from '@/modules/pers/domain/repositori/persons-repository'
import { Injectable } from '@nestjs/common'

import { Either, left, right } from @core/co@core/either'
import { AppError } from @core/co@core/erro@core/app-errors'
interface DeletePersonUseCaseRequest {
    businessId: string
    personId: string
}

type DeletePersonUseCaseResponse = Either<
    AppError,
    null
>

@Injectable()
export class DeletePersonUseCase {
    constructor(private personsRepository: PersonsRepository) { }

    async execute({
        businessId,
        personId,
    }: DeletePersonUseCaseRequest): Promise<DeletePersonUseCaseResponse> {
        const person = await this.personsRepository.findById(personId, businessId)

        if (!person) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (businessId !== person.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'))
        }

        await this.personsRepository.delete(person)

        return right(null)
    }
}