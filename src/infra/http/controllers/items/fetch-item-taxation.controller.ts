import { BadRequestException, Get, Controller, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { ItemTaxationPresenter } from '@/infra/http/presenters/item-taxation-presenter'
import { FetchItemTaxationUseCase } from '@/domain/item/use-cases/fech-item-taxation'
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

@Controller('/itemstaxation')
export class FetchItemTaxationController {
    constructor(private fetchItemTaxation: FetchItemTaxationUseCase) { }

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @CurrentUser() user: UserPayload,
    ) {

        const business = user.bus
        const result = await this.fetchItemTaxation.execute({
            page,
            businessId: business,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const itemsTaxation = result.value.itemTaxation

        return { itemsTaxation: itemsTaxation.map(ItemTaxationPresenter.toHttp) }
    }
}
