import { BadRequestException, Get, Controller, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'

import { SaleDetailsPresenter } from '@/infra/http/presenters/sale-details-presenter'

import { FetchSaleUseCase } from '@/domain/sale/use-cases/fetch-sale'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/sale')
export class FetchSaleController {
    constructor(private fetchSale: FetchSaleUseCase) { }

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @CurrentUser() user: UserPayload,
    ) {

        const business = user.bus
        const result = await this.fetchSale.execute({
            page,
            businessId: business,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const sales = result.value.sales

        return { sales: sales.map(SaleDetailsPresenter.toHttp) }
    }
}
