import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteItemUseCase } from '@/domain/item/use-cases/delete-item'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

@Controller('/item/:id')
export class DeleteItemController {
    constructor(private deleteItem: DeleteItemUseCase) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') itemId: string,
    ) {
        const businessId = user.bus

        const result = await this.deleteItem.execute({
            businessId: businessId,
            itemId: itemId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
