import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UserBusinessRepository } from '../repositories/user-business-repository'
import { AppError } from '@/core/errors/app-errors'

interface DeleteUserBusinessUseCaseRequest {
    userBusinessId: string
}

type DeleteUserBusinessUseCaseResponse = Either<
    AppError,
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
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        await this.userBusinessRepository.delete(userBusiness)

        return right(null)
    }
}
