import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditItemUseCase } from '@/domain/item/use-cases/edit-item'

const editItemBodySchema = z.object({
    descripion: z.string(),
    idAux: z.string(),
    unit: z.string(),
    price: z.number(),
    itemType: z.string(),
    status: z.string(),
    groupId: z.string().optional(),
    taxationId: z.string().optional(),
    ncm: z.string().optional(),

})

const bodyValidationPipe = new ZodValidationPipe(editItemBodySchema)

type EditItemBodySchema = z.infer<typeof editItemBodySchema>

@Controller('/item/:id')
export class EditItemController {
    constructor(private editItem: EditItemUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: EditItemBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') itemId: string,
    ) {
        const {
            descripion,
            idAux,
            unit,
            price,
            itemType,
            status,
            groupId,
            taxationId,
            ncm,
        } = body

        const businessId = user.bus

        const result = await this.editItem.execute({
            businessId: businessId,
            itemId: itemId,
            description: descripion,
            idAux: idAux,
            unit: unit,
            price: price,
            itemType: itemType,
            status: status,
            groupId: groupId,
            taxationId: taxationId,
            ncm: ncm,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
