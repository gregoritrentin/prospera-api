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
import { EditAppUseCase } from '@/domain/app/use-cases/edit-app'

const editAppBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    status: z.string(),

})

const bodyValidationPipe = new ZodValidationPipe(editAppBodySchema)

type EditAppBodySchema = z.infer<typeof editAppBodySchema>

@Controller('/app/:id')
export class EditAppController {
    constructor(private editApp: EditAppUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: EditAppBodySchema,
        @Param('id') appId: string,
    ) {
        const {
            name,
            description,
            price,
            status,
        } = body

        const result = await this.editApp.execute({
            appId,
            name,
            description,
            price,
            status,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
