import { Either, left, right } from '@/core/either'
import { AppError } from '@/core/error/app-errors'
import { App } from '@/modules/application/domain/entities/app'
import { AppRepository } from '@/modules/application/domain/repositories/app-repository'
import { Injectable } from '@nestjs/common'
import { AppType } from '@/core/utils/enums'

interface EditAppUseCaseRequest {
    appId: string
    name: string
    description: string
    price: number
    quantity: number
    type: AppType
    status: string
}

type EditAppUseCaseResponse = Either<
    AppError,
    {
        app: App
    }
>

@Injectable()
export class EditAppUseCase {
    constructor(
        private appRepository: AppRepository,
    ) { }

    async execute({

        appId,
        name,
        description,
        price,
        quantity,
        type,
        status,

    }: EditAppUseCaseRequest): Promise<EditAppUseCaseResponse> {
        const app = await this.appRepository.findById(appId)

        if (!app) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        app.name = name
        app.description = description
        app.price = price
        app.quantity = quantity
        app.type = type
        app.status = status

        await this.appRepository.save(app)

        return right({
            app,
        })
    }
}