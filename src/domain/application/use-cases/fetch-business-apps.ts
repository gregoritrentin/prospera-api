import { BusinessAppDetails } from '@/domain/application/entities/value-objects/business-app-details'
import { BusinessAppRepository } from '@/domain/application/repositories/business-app-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface FetchBusinessAppsUseCaseRequest {
    businessId: string,
}

type FetchBusinessAppsUseCaseResponse = Either<
    null,
    {
        businessApp: BusinessAppDetails[]
    }
>

@Injectable()
export class FetchBusinessAppUseCase {
    constructor(private businessAppRepository: BusinessAppRepository) { }

    async execute({ businessId }: FetchBusinessAppsUseCaseRequest): Promise<FetchBusinessAppsUseCaseResponse> {

        const businessApp = await this.businessAppRepository.findMany(businessId)

        return right({
            businessApp,
        })
    }
}