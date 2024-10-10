import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateAppUseCase } from '@/domain/application/use-cases/create-app'

const createAppBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    quantity: z.number(),
    type: z.string(),
    status: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createAppBodySchema)

type CreateAppBodySchema = z.infer<typeof createAppBodySchema>

@Controller('/app')
export class CreateAppController {
    constructor(private createApp: CreateAppUseCase) { }

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CreateAppBodySchema,
    ) {
        const {
            name,
            description,
            price,
            quantity,
            type,
            status
        } = body

        const result = await this.createApp.execute({
            name,
            description,
            price,
            quantity,
            type,
            status,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }

}
