import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteItemTaxationUseCase } from '@/domain/item/use-cases/delete-item-taxation'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

@Controller('/itemtaxation/:id')
export class DeleteItemTaxationController {
    constructor(private deleteItemTaxation: DeleteItemTaxationUseCase) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') itemTaxationId: string,
    ) {
        const businessId = user.bus

        const result = await this.deleteItemTaxation.execute({
            businessId: businessId,
            taxationId: itemTaxationId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
