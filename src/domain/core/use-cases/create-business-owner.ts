import { BusinessOwner } from '@/domain/core/entities/business-owner'
import { BusinessOwnerRepository } from '@/domain/core/repositories/business-owner-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateBusinessOwnerUseCaseRequest {
    businessId: string
    name: string
    phone: string
    email: string
    document: string
    addressLine1: string
    addressLine2: string
    addressLine3?: string | null | undefined
    neighborhood: string
    postalCode: string
    countryCode: string
    stateCode: string
    cityCode: string
    birthDate: Date
    status: string
    ownerType: string
}

type CreateBusinessOwnerUseCaseResponse = Either<
    null,
    {
        businessOwner: BusinessOwner
    }
>

@Injectable()
export class CreateBusinessOwnerUseCase {
    constructor(private businessownersRepository: BusinessOwnerRepository) { }

    async execute({
        businessId,
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
        stateCode,
        cityCode,
        birthDate,
        status,
        ownerType

    }: CreateBusinessOwnerUseCaseRequest): Promise<CreateBusinessOwnerUseCaseResponse> {
        const businessOwner = BusinessOwner.create({
            businessId: new UniqueEntityID(businessId),
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
            stateCode,
            cityCode,
            birthDate,
            status: 'PENDING',
            ownerType,
        })

        await this.businessownersRepository.create(businessOwner)

        return right({
            businessOwner,
        })
    }
}
