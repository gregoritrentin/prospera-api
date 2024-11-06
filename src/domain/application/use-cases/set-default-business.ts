import { Either, left, right } from '@/core/either'
import { AppError } from '@/core/errors/app-errors'
import { User } from '@/domain/application/entities/user'
import { UserRepository } from '@/domain/application/repositories/user-repository'
import { Injectable } from '@nestjs/common'

interface SetDefaultBusinessUseCaseRequest {
    userId: string
    businessId: string
}

type SetDefaultBusinessUseCaseResponse = Either<
    AppError,
    {
        user: User
    }
>

@Injectable()
export class SetDefaultBusinessUseCase {
    constructor(
        private userRepository: UserRepository,

    ) { }

    async execute({
        userId,
        businessId,

    }: SetDefaultBusinessUseCaseRequest): Promise<SetDefaultBusinessUseCaseResponse> {

        const user = await this.userRepository.findById(userId)

        if (!user) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        user.defaultBusiness = businessId

        await this.userRepository.setDefaultBusiness(userId, businessId)

        return right({
            user,
        })
    }
}
