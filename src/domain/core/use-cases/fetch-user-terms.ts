import { UserTerm } from '@/domain/core/entities/user-term'
import { UserTermRepository } from '@/domain/core/repositories/user-term-repository'
import { Either, right, left } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface FetchUserTermUseCaseRequest {
    userId: string,
}

type FetchUserTermUseCaseResponse = Either<
    ResourceNotFoundError,
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
            return left(new ResourceNotFoundError())
        }

        return right({
            userTerm,
        })

    }
}