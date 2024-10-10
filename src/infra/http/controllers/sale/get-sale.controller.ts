import {
    BadRequestException,
    Controller,
    Param,
    Get,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { GetSaleUseCase } from '@/domain/sale/use-cases/get-sale'
import { SalePresenter } from '@/infra/http/presenters/sale-presenter'

@Controller('/sale/:id')
export class GetSaleController {
    constructor(private getSale: GetSaleUseCase) { }

    @Get()
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') saleId: string,
    ) {

        const businessId = user.bus

        const result = await this.getSale.execute({
            businessId: businessId,
            saleId: saleId,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const sale = result.value.sale

        return SalePresenter.toHttp(sale)
    }
}
