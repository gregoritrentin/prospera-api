import { Marketplace } from '@/domain/core/entities/marketplace'
import { MarketplaceRepository } from '@/domain/core/repositories/marketplace-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface CreateMarketplaceUseCaseRequest {

  name: string
  status: string
}

type CreateMarketplaceUseCaseResponse = Either<
  null,
  {
    marketplace: Marketplace
  }
>

@Injectable()
export class CreateMarketplaceUseCase {
  constructor(private marketplaceRepository: MarketplaceRepository) { }

  async execute({
    name,
    status,

  }: CreateMarketplaceUseCaseRequest): Promise<CreateMarketplaceUseCaseResponse> {
    const marketplace = Marketplace.create({
      name,
      status,
    })

    await this.marketplaceRepository.create(marketplace)

    return right({
      marketplace,
    })
  }
}
