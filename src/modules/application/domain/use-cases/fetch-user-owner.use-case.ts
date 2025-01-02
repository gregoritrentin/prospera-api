import { BusinessOwner } from '@/modules/application/domain/entities/business-owner'
import { BusinessOwnerRepository } from '@/modules/application/domain/repositories/business-owner-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface FetchBusinessOwnerUseCaseRequest {
    businessId: string,
}

type FetchBusinessOwnerUseCaseResponse = Either<
    null,
    {
        businessOwner: BusinessOwner[]
    }
>

@Injectable()
export class FetchBusinessOwnerUseCase {
    constructor(private businessOwnerRepository: BusinessOwnerRepository) { }

    async execute({ businessId }: FetchBusinessOwnerUseCaseRequest): Promise<FetchBusinessOwnerUseCaseResponse> {

        const businessOwner = await this.businessOwnerRepository.findMany(businessId)

        return right({
            businessOwner,
        })
    }
}