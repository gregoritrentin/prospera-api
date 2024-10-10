import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteSaleUseCase } from '@/domain/sale/use-cases/delete-sale'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

@Controller('/sale/:id')
export class DeletePersonController {
    constructor(private deleteSale: DeleteSaleUseCase) { }

    @Delete()
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') saleId: string,
    ) {
        const businessId = user.bus

        const result = await this.deleteSale.execute({
            businessId: businessId,
            saleId: saleId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}
