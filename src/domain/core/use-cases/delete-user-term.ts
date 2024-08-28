import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { UserTermRepository } from '../repositories/user-term-repository'

interface DeleteUserTermUseCaseRequest {
    userTermId: string
}

type DeleteUserTermUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
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
            return left(new ResourceNotFoundError())
        }

        await this.userTermRepository.delete(userTerm)

        return right(null)
    }
}
