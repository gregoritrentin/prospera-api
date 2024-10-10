import { Either, left, right } from '@/core/either'
import { AppError } from '@/core/errors/app-errors'
import { BusinessRepository } from '@/domain/application/repositories/business-repository'
import { Injectable } from '@nestjs/common'

interface DeleteBusinessUseCaseRequest {
    businessId: string
}

type DeleteBusinessUseCaseResponse = Either<
    AppError,
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
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        await this.businessRepository.delete(business)

        return right(null)
    }
}
