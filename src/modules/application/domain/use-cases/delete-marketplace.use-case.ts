import { Either, left, right } from '@/core/either'
import { AppError } from '@/core/error/app-errors'
import { MarketplaceRepository } from '@/modules/application/domain/repositories/marketplace-repository'
import { Injectable } from '@nestjs/common'

interface DeleteMarketplaceUseCaseRequest {
    MarketplaceId: string
}

type DeleteMarketplaceUseCaseResponse = Either<
    AppError,
    null
>

@Injectable()
export class DeleteMarketplaceUseCase {
    constructor(private MarketplaceRepository: MarketplaceRepository) { }

    async execute({
        MarketplaceId,
    }: DeleteMarketplaceUseCaseRequest): Promise<DeleteMarketplaceUseCaseResponse> {
        const marketplace = await this.MarketplaceRepository.findById(MarketplaceId)

        if (!marketplace) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        await this.MarketplaceRepository.delete(marketplace)

        return right(null)
    }
}