import { Either, left, right } from '@/core/either'
import { AppError } from '@/core/errors/app-errors'
import { UserRepository } from '@/domain/application/repositories/user-repository'
import { Injectable } from '@nestjs/common'

interface DeleteUserUseCaseRequest {
    userId: string
}

type DeleteUserUseCaseResponse = Either<
    AppError,
    null
>

@Injectable()
export class DeleteUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute({
        userId,
    }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
        const user = await this.userRepository.findById(userId)

        if (!user) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        // if (businessId !== person.businessId.toString()) {
        //     return left(new NotAllowedError())
        // }

        await this.userRepository.delete(user)

        return right(null)
    }
}
