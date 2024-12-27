import { Either, left, right } from '@/core/either'
import { AppError } from '@core/error/app-errors'
import { TermRepository } from '@/domain/application/repositories/term-repository'
import { Injectable } from '@nestjs/common'

interface DeleteTermUseCaseRequest {
    termId: string
}

type DeleteTermUseCaseResponse = Either<
    AppError,
    null
>

@Injectable()
export class DeleteTermUseCase {
    constructor(private termRepository: TermRepository) { }

    async execute({
        termId,
    }: DeleteTermUseCaseRequest): Promise<DeleteTermUseCaseResponse> {
        const term = await this.termRepository.findById(termId)

        if (!term) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        await this.termRepository.delete(term)

        return right(null)
    }
}
