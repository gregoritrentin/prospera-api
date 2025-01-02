import { Either, left, right } from '@/core/either'
import { AppError } from '@/core/error/app-errors'
import { AppRepository } from '@/modules/application/domain/repositories/app-repository'
import { Injectable } from '@nestjs/common'

interface DeleteAppUseCaseRequest {
    appId: string
}

type DeleteAppUseCaseResponse = Either<
    AppError,
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
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        await this.appRepository.delete(app)

        return right(null)
    }
}