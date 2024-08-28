import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { UserBusinessRepository } from '../repositories/user-business-repository'

interface DeleteUserBusinessUseCaseRequest {
    userBusinessId: string
}

type DeleteUserBusinessUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    null
>

@Injectable()
export class DeleteUserBusinessUseCase {
    constructor(private userBusinessRepository: UserBusinessRepository) { }

    async execute({
        userBusinessId,
    }: DeleteUserBusinessUseCaseRequest): Promise<DeleteUserBusinessUseCaseResponse> {
        const userBusiness = await this.userBusinessRepository.findById(userBusinessId)

        if (!userBusiness) {
            return left(new ResourceNotFoundError())
        }

        await this.userBusinessRepository.delete(userBusiness)

        return right(null)
    }
}
