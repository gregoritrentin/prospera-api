import { Term } from '@/domain/core/entities/term'
import { TermRepository } from '@/domain/core/repositories/term-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface FetchTermUseCaseRequest {
    page: number,
}

type FetchTermUseCaseResponse = Either<
    null,
    {
        term: Term[]
    }
>

@Injectable()
export class FetchTermUseCase {
    constructor(private termRepository: TermRepository) { }

    async execute({ page }: FetchTermUseCaseRequest): Promise<FetchTermUseCaseResponse> {

        const term = await this.termRepository.findMany({ page })

        return right({
            term,
        })
    }
}