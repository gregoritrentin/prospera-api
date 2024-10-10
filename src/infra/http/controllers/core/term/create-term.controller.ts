import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateTermUseCase } from '@/domain/application/use-cases/create-term'

const createTermBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    language: z.string(),
    startAt: z.date(),
})

const bodyValidationPipe = new ZodValidationPipe(createTermBodySchema)

type CreateTermBodySchema = z.infer<typeof createTermBodySchema>

@Controller('/terms')
export class CreateTermController {
    constructor(private createTerm: CreateTermUseCase) { }

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CreateTermBodySchema,
    ) {
        const {
            title,
            content,
            language,
            startAt,
        } = body

        const result = await this.createTerm.execute({
            title,
            content,
            language,
            startAt,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }

}
