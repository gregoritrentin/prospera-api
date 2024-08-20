import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { User } from '@/domain/user/entities/users'
import { UserRepository } from '@/domain/user/repositories/user-repository'
import { Injectable } from '@nestjs/common'

interface GetUserUseCaseRequest {
    userId: string
}

type GetUserUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        user: User[]
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

        return right({
            user,
        })
    }
}
