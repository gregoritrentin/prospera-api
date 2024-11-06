import { Either, left, right } from '@/core/either'
import { User } from '@/domain/application/entities/user'
import { UserRepository } from '@/domain/application/repositories/user-repository'
import { Injectable } from '@nestjs/common'
import { UserDetails } from '@/domain/application/entities/value-objects/user-details'
import { AppError } from '@/core/errors/app-errors'

interface GetUserUseCaseRequest {
    userId: string
}

type GetUserUseCaseResponse = Either<
    AppError,
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
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        return right({
            user,
        })
    }
}
