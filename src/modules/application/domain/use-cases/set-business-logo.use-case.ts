import { Either, left, right } from '@/core/either'
import { BusinessRepository } from '@/modules/application/domain/repositories/business-repository'
import { Injectable } from '@nestjs/common'
import { Business } from '@/modules/application/domain/entities/business'
import { AppError } from '@/core/error/app-errors'

interface SetBusinessLogoUseCaseRequest {
    businessId: string
    logoFileId: string
}

type SetBusinessLogoUseCaseResponse = Either<
    AppError,
    {
        business: Business
    }
>

@Injectable()
export class SetBusinessLogoUseCase {
    constructor(
        private businessRepository: BusinessRepository,

    ) { }

    async execute({
        businessId,
        logoFileId,

    }: SetBusinessLogoUseCaseRequest): Promise<SetBusinessLogoUseCaseResponse> {

        const business = await this.businessRepository.findById(businessId)

        if (!business) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        business.logoFileId = logoFileId

        await this.businessRepository.setLogo(businessId, logoFileId)

        return right({
            business,
        })
    }
}