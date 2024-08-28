import { Either, left, right } from '@/core/either'
import { BusinessAppRepository } from '@/domain/core/repositories/business-app-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteBusinessAppUseCaseRequest {
    appId: string
}

type DeleteBusinessAppUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    null
>

@Injectable()
export class DeleteAppUseCase {
    constructor(private businessAppRepository: BusinessAppRepository) { }

    async execute({
        appId,
    }: DeleteBusinessAppUseCaseRequest): Promise<DeleteBusinessAppUseCaseResponse> {
        const businessApp = await this.businessAppRepository.findById(appId)

        if (!businessApp) {
            return left(new ResourceNotFoundError())
        }

        await this.businessAppRepository.delete(businessApp)

        return right(null)
    }
}
