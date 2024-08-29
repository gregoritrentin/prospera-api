import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { BusinessRepository } from '@/domain/core/repositories/business-repository'
import { Injectable } from '@nestjs/common'
import { Business } from '@/domain/core/entities/business'

interface SetBusinessLogoUseCaseRequest {
    businessId: string
    logoFileId: string
}

type SetBusinessLogoUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
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
            return left(new ResourceNotFoundError())
        }

        business.logoFileId = logoFileId

        await this.businessRepository.setLogo(businessId, logoFileId)

        return right({
            business,
        })
    }
}
