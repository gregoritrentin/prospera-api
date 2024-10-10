import { Either, right } from '@/core/either'
import { AppError } from '@/core/errors/app-errors'
import { Business } from '@/domain/application/entities/business'
import { BusinessRepository } from '@/domain/application/repositories/business-repository'
import { Injectable } from '@nestjs/common'

interface GetBusinessUseCaseRequest {
    businessId: string
}

type GetBusinessUseCaseResponse = Either<
    AppError,
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
