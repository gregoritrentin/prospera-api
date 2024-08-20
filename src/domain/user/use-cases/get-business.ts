import { Either, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Business } from '@/domain/business/entities/business'
import { BusinessRepository } from '@/domain/business/repository/business-repository'
import { Injectable } from '@nestjs/common'

interface GetBusinessUseCaseRequest {
    businessId: string
}

type GetBusinessUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        business: Business[]
    }
>

@Injectable()
export class GetBusinessUseCase {
    constructor(
        private businessRepository: BusinessRepository) { }

    async execute({
        businessId,

    }: GetBusinessUseCaseRequest): Promise<GetBusinessUseCaseResponse> {
        const business = await this.businessRepository.findMe(businessId)

        return right({
            business,
        })
    }
}
