import { BadRequestException, Get, Controller, UseGuards, Query } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { TermPresenter } from '@/infra/http/presenters/term-presenter'
import { FetchTermUseCase } from '@/domain/core/use-cases/fetch-term'

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/term')
@UseGuards(JwtAuthGuard)
export class FetchTermController {
    constructor(private fetchTerm: FetchTermUseCase) { }

    @Get()
    async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {

        const result = await this.fetchTerm.execute({
            page,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const term = result.value.term

        return { term: term.map(TermPresenter.toHttp) }
    }
}