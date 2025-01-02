import { Either, left, right } from '@/core/either'
import { AppError } from '@/core/error/app-errors'
import { User } from '@/modules/application/domain/entities/users'
import { UserRepository } from '@/modules/application/domain/repositories/user-repository'
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