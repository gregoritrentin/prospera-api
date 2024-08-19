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
import { EditItemTaxationUseCase } from '@/domain/item/use-cases/edit-item-taxation'

const editItemTaxationBodySchema = z.object({
    taxation: z.string(),
    status: z.string(),

})

const bodyValidationPipe = new ZodValidationPipe(editItemTaxationBodySchema)

type EditItemTaxationBodySchema = z.infer<typeof editItemTaxationBodySchema>

@Controller('/itemtaxation/:id')
export class EditItemTaxationController {
    constructor(private editItemTaxation: EditItemTaxationUseCase) { }

    @Put()
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: EditItemTaxationBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') taxationId: string,
    ) {
        const {
            taxation,
            status,
        } = body

        const businessId = user.bus

        const result = await this.editItemTaxation.execute({
            businessId: businessId,
            taxationId: taxationId,
            taxation: taxation,
            status: status,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
