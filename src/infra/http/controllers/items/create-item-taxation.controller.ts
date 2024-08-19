import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { CreateItemTaxationUseCase } from '@/domain/item/use-cases/create-item-taxation'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const createItemTaxationBodySchema = z.object({
    taxation: z.string(),
    status: z.string(),

})

const bodyValidationPipe = new ZodValidationPipe(createItemTaxationBodySchema)

type CreateItemTaxationBodySchema = z.infer<typeof createItemTaxationBodySchema>

@Controller('/item')
export class CreateItemTaxationController {
    constructor(private createItemTaxation: CreateItemTaxationUseCase) { }

    @Post('/taxation')
    async handle(
        @Body(bodyValidationPipe) body: CreateItemTaxationBodySchema,
        @CurrentUser() user: UserPayload,
    ) {
        const {
            taxation,
            status

        } = body

        const business = user.bus

        const result = await this.createItemTaxation.execute({
            businessId: business,
            taxation,
            status,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}



