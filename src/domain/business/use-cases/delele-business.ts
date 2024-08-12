import { Either, left, right } from '@/core/either'
import { BusinessRepository } from '@/domain/business/repository/business-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteBusinessUseCaseRequest {
    businessId: string
}

type DeleteBusinessUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    null
>

@Injectable()
export class DeleteBusinessUseCase {
    constructor(private businessRepository: BusinessRepository) { }

    async execute({
        businessId,
    }: DeleteBusinessUseCaseRequest): Promise<DeleteBusinessUseCaseResponse> {
        const business = await this.businessRepository.findById(businessId)

        if (!business) {
            return left(new ResourceNotFoundError())
        }

        await this.businessRepository.delete(business)

        return right(null)
    }
}
