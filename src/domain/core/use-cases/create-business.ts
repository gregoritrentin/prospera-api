import { Business } from '@/domain/core/entities/business'
import { BusinessRepository } from '@/domain/core/repositories/business-repository'
import { UserRepository } from '@/domain/core/repositories/user-repository'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AlreadyExistsError } from './errors/already-exists-error'

interface CreateBusinessUseCaseRequest {

  marketplaceId: string
  name: string
  phone: string
  email: string
  document: string
  ie?: string | null | undefined
  im?: string | null | undefined
  addressLine1: string
  addressLine2: string
  addressLine3?: string | null | undefined
  neighborhood: string
  postalCode: string
  countryCode: string
  state: string
  city: string
  businessSize: string
  businessType: string
  logoFileId?: string | undefined
  digitalCertificateFileId?: string | undefined
}

type CreateBusinessUseCaseResponse = Either<
  AlreadyExistsError,
  {
    business: Business
  }
>

@Injectable()
export class CreateBusinessUseCase {
  constructor(
    private businesssRepository: BusinessRepository,
  ) { }

  async execute({
    marketplaceId,
    name,
    phone,
    email,
    document,
    ie,
    im,
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
    logoFileId,
    digitalCertificateFileId

  }: CreateBusinessUseCaseRequest): Promise<CreateBusinessUseCaseResponse> {

    const businessWithSameDocument = await this.businesssRepository.findByDocument(document)

    if (businessWithSameDocument) {
      return left(new AlreadyExistsError(document))
    }

    const business = Business.create({
      marketplaceId: new UniqueEntityID(marketplaceId),
      name,
      phone,
      email,
      document,
      ie,
      im,
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
      logoFileId,
      digitalCertificateFileId

    })

    await this.businesssRepository.create(business)

    return right({
      business,
    })

  }
}
