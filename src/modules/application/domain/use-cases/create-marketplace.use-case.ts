import { Marketplace } from '@/modules/application/domain/entities/marketplace'
import { MarketplaceRepository } from '@/modules/application/domain/repositories/marketplace-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface CreateMarketplaceUseCaseRequest {

  name: string
  document: string
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
    document,
    status,

  }: CreateMarketplaceUseCaseRequest): Promise<CreateMarketplaceUseCaseResponse> {
    const marketplace = Marketplace.create({
      name,
      document,
      status,
    })

    await this.marketplaceRepository.create(marketplace)

    return right({
      marketplace,
    })
  }
}