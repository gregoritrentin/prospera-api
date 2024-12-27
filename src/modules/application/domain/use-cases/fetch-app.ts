import { App } from '@/domain/application/entities/app'
import { AppRepository } from '@/domain/application/repositories/app-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface FetchAppsUseCaseRequest {
    page: number,
}

type FetchAppsUseCaseResponse = Either<
    null,
    {
        app: App[]
    }
>

@Injectable()
export class FetchAppUseCase {
    constructor(private appRepository: AppRepository) { }

    async execute({ page }: FetchAppsUseCaseRequest): Promise<FetchAppsUseCaseResponse> {

        const app = await this.appRepository.findMany({ page })


        return right({
            app,
        })
    }
}