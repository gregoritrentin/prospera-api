import { App } from '@/modules/application/domain/entities/app'
import { AppRepository } from '@/modules/application/domain/repositories/app-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { AppType } from '@/core/utils/enums'

interface CreateAppUseCaseRequest {

    name: string
    description: string
    price: number
    quantity: number
    type: AppType
    status: string
}

type CreateAppUseCaseResponse = Either<
    null,
    {
        app: App
    }
>

@Injectable()
export class CreateAppUseCase {
    constructor(private appRepository: AppRepository) { }

    async execute({
        name,
        description,
        price,
        quantity,
        type,
        status,

    }: CreateAppUseCaseRequest): Promise<CreateAppUseCaseResponse> {
        const app = App.create({
            name,
            description,
            price,
            quantity,
            type,
            status,
        })

        await this.appRepository.create(app)

        return right({
            app,
        })
    }
}