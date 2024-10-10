import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateBusinessAppUseCase } from '@/domain/application/use-cases/create-business-app'

const createBusinessAppBodySchema = z.object({
    businessId: z.string(),
    appId: z.string(),
    quantity: z.number(),
    price: z.number(),

})

const bodyValidationPipe = new ZodValidationPipe(createBusinessAppBodySchema)

type CreateBusinessAppBodySchema = z.infer<typeof createBusinessAppBodySchema>

@Controller('/business/app')
export class CreateBusinessAppController {
    constructor(private createBusinessApp: CreateBusinessAppUseCase) { }

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CreateBusinessAppBodySchema,
    ) {
        const {
            businessId,
            appId,
            quantity,
            price

        } = body

        const result = await this.createBusinessApp.execute({
            businessId,
            appId,
            quantity,
            price
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
