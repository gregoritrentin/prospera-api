import { Business } from '@/domain/business/entities/business'
import { BusinessRepository } from '@/domain/business/repository/business-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateBusinessUseCaseRequest {
  marketplaceId: string
  name: string
  phone: string
  email: string
  document: string
  addressLine1: string
  addressLine2: string
  addressLine3?: string | null
  neighborhood: string
  postalCode: string
  countryCode: string
  state: string
  city: string
  businessSize: string
  businessType: string
}

type CreateBusinessUseCaseResponse = Either<
  null,
  {
    business: Business
  }
>

@Injectable()
export class CreateBusinessUseCase {
  constructor(private businesssRepository: BusinessRepository) { }

  async execute({
    marketplaceId,
    name,
    phone,
    email,
    document,
    addressLine1,
    addressLine2,
    addressLine3,
    neighborhood,
    postalCode,
    countryCode,
    state,
    city,
    businessSize,
    businessType,

  }: CreateBusinessUseCaseRequest): Promise<CreateBusinessUseCaseResponse> {
    const business = Business.create({
      marketplaceId: new UniqueEntityID(marketplaceId),
      name,
      phone,
      email,
      document,
      addressLine1,
      addressLine2,
      addressLine3,
      neighborhood,
      postalCode,
      countryCode,
      state,
      city,
      status: 'INACTIVE',
      businessSize,
      businessType,
    })

    await this.businesssRepository.create(business)

    return right({
      business,
    })
  }
}
