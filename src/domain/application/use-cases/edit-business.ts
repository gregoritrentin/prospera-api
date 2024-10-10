import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AppError } from '@/core/errors/app-errors'
import { Business } from '@/domain/application/entities/business'
import { BusinessRepository } from '@/domain/application/repositories/business-repository'
import { Injectable } from '@nestjs/common'

interface EditBusinessUseCaseRequest {
    businessId: string
    marketplaceId: string
    name: string
    phone: string
    email: string
    document: string
    ie: string
    im: string
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
    status: string
}

type EditBusinessUseCaseResponse = Either<
    AppError,
    {
        business: Business
    }
>

@Injectable()
export class EditBusinessUseCase {
    constructor(
        private businessRepository: BusinessRepository,
    ) { }

    async execute({
        marketplaceId,
        businessId,
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
        status,

    }: EditBusinessUseCaseRequest): Promise<EditBusinessUseCaseResponse> {
        const business = await this.businessRepository.findById(businessId)

        if (!business) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        business.marketplaceId = new UniqueEntityID(marketplaceId)
        business.name = name
        business.phone = phone
        business.email = email
        business.document = document
        business.ie = ie
        business.im = im
        business.addressLine1 = addressLine1
        business.addressLine2 = addressLine2
        business.addressLine3 = addressLine3
        business.neighborhood = neighborhood
        business.postalCode = postalCode
        business.countryCode = countryCode
        business.stateCode = stateCode
        business.cityCode = cityCode
        business.businessSize = businessSize
        business.businessType = businessType
        business.foundingDate = foundingDate
        business.status = status

        await this.businessRepository.save(business)

        return right({
            business,
        })
    }
}
