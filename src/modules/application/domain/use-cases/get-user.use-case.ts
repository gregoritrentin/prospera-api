import { Either, left, right } from '@/core/either'
import { User } from '@/modules/application/domain/entities/users'
import { UserRepository } from '@/modules/application/domain/repositories/user-repository'
import { Injectable } from '@nestjs/common'
import { UserDetails } from '@/modules/application/domain/entities/value-objects/user-details'
import { AppError } from '@/core/error/app-errors'

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