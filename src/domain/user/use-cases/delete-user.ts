import { Either, left, right } from '@/core/either'
import { UserRepository } from '@/domain/user/repositories/user-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteUserUseCaseRequest {
    userId: string
}

type DeleteUserUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
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
            return left(new ResourceNotFoundError())
        }

        // if (businessId !== person.businessId.toString()) {
        //     return left(new NotAllowedError())
        // }

        await this.userRepository.delete(user)

        return right(null)
    }
}
