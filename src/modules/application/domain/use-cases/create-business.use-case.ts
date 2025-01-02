import { Business } from '@/modules/application/domain/entities/business'
import { BusinessRepository } from '@/modules/application/domain/repositories/business-repository'
import { UserRepository } from '@/modules/application/domain/repositories/user-repository'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/domain/entity/unique-entity-id'
import { AppError } from '@/core/error/app-errors'

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
  stateCode: string
  cityCode: string
  businessSize: string
  businessType: string
  foundingDate: Date
  logoFileId?: string | undefined
  digitalCertificateFileId?: string | undefined
}

type CreateBusinessUseCaseResponse = Either<
  AppError,
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
    stateCode,
    cityCode,
    businessSize,
    businessType,
    foundingDate,
    logoFileId,
    digitalCertificateFileId

  }: CreateBusinessUseCaseRequest): Promise<CreateBusinessUseCaseResponse> {

    const businessWithSameDocument = await this.businesssRepository.findByDocument(document)

    if (businessWithSameDocument) {
      return left(AppError.uniqueConstraintViolation('business', 'document', document))
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
      stateCode,
      cityCode,
      status: 'INACTIVE',
      businessSize,
      businessType,
      foundingDate,
      logoFileId,
      digitalCertificateFileId

    })

    await this.businesssRepository.create(business)

    return right({
      business,
    })

  }
}