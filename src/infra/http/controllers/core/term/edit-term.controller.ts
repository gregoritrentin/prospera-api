import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditTermUseCase } from '@/domain/application/use-cases/edit-term'

const editTermBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    language: z.string(),
    startAt: z.date(),
})

const bodyValidationPipe = new ZodValidationPipe(editTermBodySchema)

type EditTermBodySchema = z.infer<typeof editTermBodySchema>

@Controller('/term/:id')
export class EditTermController {
    constructor(private editTerm: EditTermUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: EditTermBodySchema,
        @Param('id') termId: string,
    ) {
        const {
            title,
            content,
            language,
            startAt,
        } = body

        const result = await this.editTerm.execute({
            termId,
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
