import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { User } from '@/domain/core/entities/users'
import { UserRepository } from '@/domain/core/repositories/user-repository'
import { Injectable } from '@nestjs/common'

interface SetDefaultBusinessUseCaseRequest {
    userId: string
    businessId: string
}

type SetDefaultBusinessUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
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
            return left(new ResourceNotFoundError())
        }

        user.defaultBusiness = businessId

        await this.userRepository.setDefaultBusiness(userId, businessId)

        return right({
            user,
        })
    }
}
