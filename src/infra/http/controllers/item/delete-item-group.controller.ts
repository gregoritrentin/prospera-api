import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteItemGroupUseCase } from '@/domain/item/use-cases/delete-item-group'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

@Controller('/itemgroup/:id')
export class DeleteItemGroupController {
    constructor(private deleteItemGroup: DeleteItemGroupUseCase) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') itemGroupId: string,
    ) {
        const businessId = user.bus

        const result = await this.deleteItemGroup.execute({
            businessId: businessId,
            groupId: itemGroupId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
