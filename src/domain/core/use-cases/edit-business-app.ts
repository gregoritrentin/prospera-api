import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { BusinessApp } from '@/domain/core/entities/business-app'
import { BusinessAppRepository } from '@/domain/core/repositories/business-app-repository'
import { Injectable } from '@nestjs/common'

interface EditBusinessAppUseCaseRequest {
    businessAppId: string
    price: number
    quantity: number
}

type EditBusinessAppUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        businessApp: BusinessApp
    }
>

@Injectable()
export class EditBusinessAppUseCase {
    constructor(
        private businessAppRepository: BusinessAppRepository,
    ) { }

    async execute({
        businessAppId,
        price,
        quantity

    }: EditBusinessAppUseCaseRequest): Promise<EditBusinessAppUseCaseResponse> {
        const businessApp = await this.businessAppRepository.findById(businessAppId)

        if (!businessApp) {
            return left(new ResourceNotFoundError())
        }

        businessApp.price = price
        businessApp.quantity = quantity
        businessApp.status = status

        await this.businessAppRepository.save(businessApp)

        return right({
            businessApp,
        })
    }
}
