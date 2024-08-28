import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { BusinessOwner } from '@/domain/core/entities/business-owner'
import { BusinessOwnerRepository } from '@/domain/core/repositories/business-owner-repository'
import { Injectable } from '@nestjs/common'

interface EditBusinessOwnerUseCaseRequest {
    businessOwnerId: string
    name: string
    phone: string
    email: string
    addressLine1: string
    addressLine2: string
    addressLine3?: string | null | undefined
    neighborhood: string
    postalCode: string
    countryCode: string
    state: string
    city: string
    status: string
    ownerType: string
}

type EditBusinessOwnerUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        businessOwner: BusinessOwner
    }
>

@Injectable()
export class EditBusinessOwnerUseCase {
    constructor(
        private businessOwnerRepository: BusinessOwnerRepository,
    ) { }

    async execute({
        businessOwnerId,
        name,
        phone,
        email,
        addressLine1,
        addressLine2,
        addressLine3,
        neighborhood,
        postalCode,
        countryCode,
        state,
        city,
        status,
        ownerType,

    }: EditBusinessOwnerUseCaseRequest): Promise<EditBusinessOwnerUseCaseResponse> {
        const businessOwner = await this.businessOwnerRepository.findById(businessOwnerId)

        if (!businessOwner) {
            return left(new ResourceNotFoundError())
        }

        businessOwner.name = name
        businessOwner.phone = phone
        businessOwner.email = email
        businessOwner.document = businessOwner.document
        businessOwner.addressLine1 = addressLine1
        businessOwner.addressLine2 = addressLine2
        businessOwner.addressLine3 = addressLine3
        businessOwner.neighborhood = neighborhood
        businessOwner.postalCode = postalCode
        businessOwner.countryCode = countryCode
        businessOwner.state = state
        businessOwner.city = city
        businessOwner.status = status
        businessOwner.ownerType = ownerType

        await this.businessOwnerRepository.save(businessOwner)

        return right({
            businessOwner,
        })
    }
}
