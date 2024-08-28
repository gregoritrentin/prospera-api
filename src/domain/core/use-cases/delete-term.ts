import { Either, left, right } from '@/core/either'
import { TermRepository } from '@/domain/core/repositories/term-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteTermUseCaseRequest {
    termId: string
}

type DeleteTermUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
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
            return left(new ResourceNotFoundError())
        }

        await this.termRepository.delete(term)

        return right(null)
    }
}
