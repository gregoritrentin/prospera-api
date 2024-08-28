import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Term } from '@/domain/core/entities/term'
import { TermRepository } from '@/domain/core/repositories/term-repository'
import { Injectable } from '@nestjs/common'


interface EditTermUseCaseRequest {
    termId: string
    title: string
    content: string
    language: string
    startAt: Date

}

type EditTermUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        term: Term
    }
>

@Injectable()
export class EditTermUseCase {
    constructor(
        private termRepository: TermRepository,
    ) { }

    async execute({
        termId,
        title,
        content,
        language,
        startAt,


    }: EditTermUseCaseRequest): Promise<EditTermUseCaseResponse> {
        const term = await this.termRepository.findById(termId)

        if (!term) {
            return left(new ResourceNotFoundError())
        }

        term.title = title
        term.content = content
        term.language = language
        term.startAt = startAt

        await this.termRepository.save(term)

        return right({
            term,
        })
    }
}
