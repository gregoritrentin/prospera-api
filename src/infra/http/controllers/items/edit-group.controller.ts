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
import { EditItemGroupUseCase } from '@/domain/item/use-cases/edit-item-group'

const editItemGroupBodySchema = z.object({
    group: z.string(),
    status: z.string(),

})

const bodyValidationPipe = new ZodValidationPipe(editItemGroupBodySchema)

type EditItemGroupBodySchema = z.infer<typeof editItemGroupBodySchema>

@Controller('/itemgroup/:id')
export class EditItemGroupController {
    constructor(private editItemGroup: EditItemGroupUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: EditItemGroupBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') groupId: string,
    ) {
        const {
            group,
            status,
        } = body

        const businessId = user.bus

        const result = await this.editItemGroup.execute({
            businessId: businessId,
            groupId: groupId,
            group: group,
            status: status,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
