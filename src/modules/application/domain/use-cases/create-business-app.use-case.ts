import { BusinessApp } from '@/modules/application/domain/entities/business-app'
import { BusinessAppRepository } from '@/modules/application/domain/repositories/business-app-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/domain/entity/unique-entity-id'

interface CreateBusinessAppUseCaseRequest {
    businessId: string
    appId: string
    price: number
    quantity: number
}

type CreateBusinessAppUseCaseResponse = Either<
    null,
    {
        businessApp: BusinessApp
    }
>

@Injectable()
export class CreateBusinessAppUseCase {
    constructor(private businessAppsRepository: BusinessAppRepository) { }

    async execute({
        businessId,
        appId,
        price,
        quantity,


    }: CreateBusinessAppUseCaseRequest): Promise<CreateBusinessAppUseCaseResponse> {
        const businessApp = BusinessApp.create({
            businessId: new UniqueEntityID(businessId),
            appId: new UniqueEntityID(appId),
            price,
            quantity,
            status: 'ACTIVE',
        })

        await this.businessAppsRepository.create(businessApp)

        return right({
            businessApp,
        })
    }
}