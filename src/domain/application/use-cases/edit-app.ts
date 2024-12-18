import { Either, left, right } from '@/core/either'
import { AppError } from '@/core/errors/app-errors'
import { App } from '@/domain/application/entities/app'
import { AppRepository } from '@/domain/application/repositories/app-repository'
import { Injectable } from '@nestjs/common'
import { AppType } from '@/core/types/enums'

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
