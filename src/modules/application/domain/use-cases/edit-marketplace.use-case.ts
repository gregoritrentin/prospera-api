import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Marketplace } from '../entities/marketplace.entity'
import { MarketplaceRepository } from '../repositories/marketplace-repository.repository'
import { AppError } from '@/core/error/app-errors'

interface EditMarketplaceUseCaseRequest {
    marketplaceId: string
    name: string
    status: string

}

type EditMarketplaceUseCaseResponse = Either<
    AppError,
    {
        marketplace: Marketplace
    }
>

@Injectable()
export class EditMarketplaceUseCase {
    constructor(
        private marketplaceRepository: MarketplaceRepository,
    ) { }

    async execute({
        marketplaceId,
        name,
        status,

    }: EditMarketplaceUseCaseRequest): Promise<EditMarketplaceUseCaseResponse> {
        const marketplace = await this.marketplaceRepository.findById(marketplaceId)

        if (!marketplace) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        marketplace.name = name
        marketplace.status = status

        await this.marketplaceRepository.save(marketplace)

        return right({
            marketplace,
        })
    }
}