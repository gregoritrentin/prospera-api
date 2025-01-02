import { Either, left, right } from '@/core/either'
import { AppError } from '@/core/error/app-errors'
import { BusinessApp } from '@/modules/application/domain/entities/business-app'
import { BusinessAppRepository } from '@/modules/application/domain/repositories/business-app-repository'
import { Injectable } from '@nestjs/common'

interface EditBusinessAppUseCaseRequest {
    businessAppId: string
    price: number
    quantity: number
}

type EditBusinessAppUseCaseResponse = Either<
    AppError,
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
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
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