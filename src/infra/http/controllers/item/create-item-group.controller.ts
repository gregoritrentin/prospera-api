import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { CreateItemGroupUseCase } from '@/domain/item/use-cases/create-item-group'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const createItemGroupBodySchema = z.object({
    group: z.string(),
    status: z.string(),

})

const bodyValidationPipe = new ZodValidationPipe(createItemGroupBodySchema)

type CreateItemGroupBodySchema = z.infer<typeof createItemGroupBodySchema>

@Controller('/item')
export class CreateItemGroupController {
    constructor(private createItemGroup: CreateItemGroupUseCase) { }

    @Post('/group')
    async handle(
        @Body(bodyValidationPipe) body: CreateItemGroupBodySchema,
        @CurrentUser() user: UserPayload,
    ) {
        const {
            group,
            status

        } = body

        const business = user.bus

        const result = await this.createItemGroup.execute({
            businessId: business,
            group,
            status,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}



