import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UserTermRepository } from '../repositories/user-term-repository'
import { AppError } from '@/core/errors/app-errors'

interface DeleteUserTermUseCaseRequest {
    userTermId: string
}

type DeleteUserTermUseCaseResponse = Either<
    AppError,
    null
>

@Injectable()
export class DeleteUserTermUseCase {
    constructor(private userTermRepository: UserTermRepository) { }

    async execute({
        userTermId,
    }: DeleteUserTermUseCaseRequest): Promise<DeleteUserTermUseCaseResponse> {
        const userTerm = await this.userTermRepository.findById(userTermId)

        if (!userTerm) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        await this.userTermRepository.delete(userTerm)

        return right(null)
    }
}
