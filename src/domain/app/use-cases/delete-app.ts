import { Either, left, right } from '@/core/either'
import { AppRepository } from '@/domain/app/repository/app-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteAppUseCaseRequest {
    appId: string
}

type DeleteAppUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    null
>

@Injectable()
export class DeleteAppUseCase {
    constructor(private appRepository: AppRepository) { }

    async execute({
        appId,
    }: DeleteAppUseCaseRequest): Promise<DeleteAppUseCaseResponse> {
        const app = await this.appRepository.findById(appId)

        if (!app) {
            return left(new ResourceNotFoundError())
        }

        await this.appRepository.delete(app)

        return right(null)
    }
}
