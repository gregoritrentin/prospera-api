import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { App } from '@/domain/core/entities/app'
import { AppRepository } from '@/domain/core/repositories/app-repository'
import { Injectable } from '@nestjs/common'

interface EditAppUseCaseRequest {
    appId: string
    name: string
    description: string
    price: number
    quantity: number
    type: string
    status: string
}

type EditAppUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
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
            return left(new ResourceNotFoundError())
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
