import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { User } from '@/domain/core/entities/users'
import { UserRepository } from '@/domain/core/repositories/user-repository'
import { Injectable } from '@nestjs/common'
import { UserDetails } from '@/domain/core/entities/value-objects/user-details'

interface GetUserUseCaseRequest {
    userId: string
}

type GetUserUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        user: UserDetails
    }
>

@Injectable()
export class GetUserUseCase {
    constructor(
        private userRepository: UserRepository) { }

    async execute({
        userId,

    }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
        const user = await this.userRepository.findMe(userId)

        if (!user) {
            return left(new ResourceNotFoundError())
        }

        return right({
            user,
        })
    }
}
