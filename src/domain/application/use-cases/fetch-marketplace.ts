import { Marketplace } from '@/domain/application/entities/marketplace'
import { MarketplaceRepository } from '@/domain/application/repositories/marketplace-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface FetchMarketplacesUseCaseRequest {
    page: number,
    businessId: string,
}

type FetchMarketplacesUseCaseResponse = Either<
    null,
    {
        marketplace: Marketplace[]
    }
>

@Injectable()
export class FetchMarketplaceUseCase {
    constructor(private marketplaceRepository: MarketplaceRepository) { }

    async execute({ page, businessId }: FetchMarketplacesUseCaseRequest): Promise<FetchMarketplacesUseCaseResponse> {

        const marketplace = await this.marketplaceRepository.findMany({ page }, businessId)

        return right({
            marketplace,
        })
    }
}