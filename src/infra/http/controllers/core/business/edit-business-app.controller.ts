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
import { EditBusinessAppUseCase } from '@/domain/application/use-cases/edit-business-app'

const editBusinessAppBodySchema = z.object({

    quantity: z.number(),
    price: z.number(),

})

const bodyValidationPipe = new ZodValidationPipe(editBusinessAppBodySchema)

type EditBusinessAppBodySchema = z.infer<typeof editBusinessAppBodySchema>

@Controller('/business/app/:id')
export class EditBusinessAppController {
    constructor(private editBusinessApp: EditBusinessAppUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: EditBusinessAppBodySchema,
        @Param('id') businessAppId: string,
    ) {
        const {
            quantity,
            price

        } = body

        const result = await this.editBusinessApp.execute({
            businessAppId,
            price,
            quantity,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
