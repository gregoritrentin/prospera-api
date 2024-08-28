import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { Marketplace } from '../entities/marketplace'
import { MarketplaceRepository } from '../repositories/marketplace-repository'

interface EditMarketplaceUseCaseRequest {
    marketplaceId: string
    name: string

}

type EditMarketplaceUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
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

    }: EditMarketplaceUseCaseRequest): Promise<EditMarketplaceUseCaseResponse> {
        const marketplace = await this.marketplaceRepository.findById(marketplaceId)

        if (!marketplace) {
            return left(new ResourceNotFoundError())
        }

        marketplace.name = name
        marketplace.status = status

        await this.marketplaceRepository.save(marketplace)

        return right({
            marketplace,
        })
    }
}
