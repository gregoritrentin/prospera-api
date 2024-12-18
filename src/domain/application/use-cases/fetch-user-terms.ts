import { UserTerm } from '@/domain/application/entities/user-term'
import { UserTermRepository } from '@/domain/application/repositories/user-term-repository'
import { Either, right, left } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { AppError } from '@/core/errors/app-errors'

interface FetchUserTermUseCaseRequest {
    userId: string,
}

type FetchUserTermUseCaseResponse = Either<
    AppError,
    {
        userTerm: UserTerm[] | null
    }
>

@Injectable()
export class FetchUserTermUseCase {
    constructor(private userTermRepository: UserTermRepository) { }

    async execute({ userId }: FetchUserTermUseCaseRequest): Promise<FetchUserTermUseCaseResponse> {

        const userTerm = await this.userTermRepository.findByUser(userId)

        if (!userTerm) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        return right({
            userTerm,
        })

    }
}