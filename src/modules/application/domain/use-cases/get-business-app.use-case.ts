import { Injectable } from '@nestjs/common'
import { Either, right, left } from '@/core/either'
import { BusinessAppRepository } from '../repositories/business-app-repository.repository'
import { BusinessAppDetails } from '../entities/value-objects/business-app-details.entity'
import { AppError } from '@/core/error/app-errors'

interface GetBusinessAppRequest {
    businessId: string
}

type GetBusinessAppResponse = Either<
    AppError,
    {
        businessApps: BusinessAppDetails[]
    }
>

@Injectable()
export class GetBusinessAppUseCase {
    constructor(
        private businessAppRepository: BusinessAppRepository
    ) { }

    async execute({
        businessId,
    }: GetBusinessAppRequest): Promise<GetBusinessAppResponse> {
        try {
            const businessApps = await this.businessAppRepository.findMany(businessId)

            if (!businessApps.length) {
                return left(AppError.resourceNotFound('Business apps not found'))
            }

            return right({
                businessApps
            })
        } catch (error) {
            return left(AppError.internalServerError('errors.INTERNAL_SERVER_ERROR'))
        }
    }
}