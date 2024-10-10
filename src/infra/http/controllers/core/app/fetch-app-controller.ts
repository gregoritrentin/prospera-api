import { BadRequestException, Get, Controller, UseGuards, Query } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AppPresenter } from '@/infra/http/presenters/app-presenter'
import { FetchAppUseCase } from '@/domain/application/use-cases/fetch-app'

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/apps')
@UseGuards(JwtAuthGuard)
export class FetchAppController {
    constructor(private fetchApps: FetchAppUseCase) { }

    @Get()
    async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {

        const result = await this.fetchApps.execute({
            page,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const app = result.value.app

        return { app: app.map(AppPresenter.toHttp) }
    }
}