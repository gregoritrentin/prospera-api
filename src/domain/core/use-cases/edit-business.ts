import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Business } from '@/domain/core/entities/business'
import { BusinessRepository } from '@/domain/core/repositories/business-repository'
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
    state: string
    city: string
    businessSize: string
    businessType: string
    status: string
}

type EditBusinessUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
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
        state,
        city,
        businessSize,
        businessType,
        status,

    }: EditBusinessUseCaseRequest): Promise<EditBusinessUseCaseResponse> {
        const business = await this.businessRepository.findById(businessId)

        if (!business) {
            return left(new ResourceNotFoundError())
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
        business.state = state
        business.city = city
        business.businessSize = businessSize
        business.businessType = businessType
        business.status = status

        await this.businessRepository.save(business)

        return right({
            business,
        })
    }
}
