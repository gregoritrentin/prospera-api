import { App } from '@/domain/app/entities/app'
import { AppRepository } from '@/domain/app/repository/app-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface CreateAppUseCaseRequest {

    name: string
    description: string
    price: number
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
        status,

    }: CreateAppUseCaseRequest): Promise<CreateAppUseCaseResponse> {
        const app = App.create({
            name,
            description,
            price,
            status,
        })

        await this.appRepository.create(app)

        return right({
            app,
        })
    }
}
