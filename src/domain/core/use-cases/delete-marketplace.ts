import { Either, left, right } from '@/core/either'
import { MarketplaceRepository } from '@/domain/core/repositories/marketplace-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteMarketplaceUseCaseRequest {
    MarketplaceId: string
}

type DeleteMarketplaceUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    null
>

@Injectable()
export class DeleteMarketplaceUseCase {
    constructor(private MarketplaceRepository: MarketplaceRepository) { }

    async execute({
        MarketplaceId,
    }: DeleteMarketplaceUseCaseRequest): Promise<DeleteMarketplaceUseCaseResponse> {
        const Marketplace = await this.MarketplaceRepository.findById(MarketplaceId)

        if (!Marketplace) {
            return left(new ResourceNotFoundError())
        }

        await this.MarketplaceRepository.delete(Marketplace)

        return right(null)
    }
}
