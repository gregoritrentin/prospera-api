import { Term } from '@/domain/application/entities/term'
import { TermRepository } from '@/domain/application/repositories/term-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface CreateTermUseCaseRequest {

    title: string
    content: string
    language: string
    startAt: Date

}

type CreateTermUseCaseResponse = Either<
    null,
    {
        term: Term
    }
>

@Injectable()
export class CreateTermUseCase {
    constructor(private termRepository: TermRepository) { }

    async execute({
        title,
        content,
        language,
        startAt,

    }: CreateTermUseCaseRequest): Promise<CreateTermUseCaseResponse> {
        const term = Term.create({
            title,
            content,
            language,
            startAt,
        })

        await this.termRepository.create(term)

        return right({
            term,
        })
    }
}
