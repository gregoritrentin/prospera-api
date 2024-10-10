import { BadRequestException, Get, Controller, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'

import { UserPresenter } from '@/infra/http/presenters/user-presenter'
import { FetchUserUseCase } from '@/domain/application/use-cases/fetch-user'


const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/users')
export class FetchUserController {
    constructor(private fetchPerson: FetchUserUseCase) { }

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    ) {

        const result = await this.fetchPerson.execute({
            page,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const user = result.value.user

        return { user: user.map(UserPresenter.toHttp) }
    }
}
