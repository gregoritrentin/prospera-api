import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { CreateItemUseCase } from '@/domain/item/use-cases/create-item'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

const createItemBodySchema = z.object({
    description: z.string(),
    idAux: z.string(),
    unit: z.string(),
    price: z.number(),
    itemType: z.string(),
    status: z.string(),
    groupId: z.string().optional(),
    taxationId: z.string().optional(),
    ncm: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createItemBodySchema)

type CreateItemBodySchema = z.infer<typeof createItemBodySchema>

@Controller('/item')
export class CreateItemController {
    constructor(private createItem: CreateItemUseCase) { }

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CreateItemBodySchema,
        @CurrentUser() user: UserPayload,
    ) {
        const {
            description,
            idAux,
            unit,
            price,
            itemType,
            status,
            groupId,
            taxationId,
            ncm,
        } = body

        const business = user.bus

        const result = await this.createItem.execute({
            businessId: business,
            description,
            idAux,
            unit,
            price,
            itemType,
            status,
            groupId: groupId || null,
            taxationId: taxationId || null,
            ncm: ncm || null,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}



