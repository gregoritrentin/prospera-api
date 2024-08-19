import { BadRequestException, Get, Controller, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'

import { ItemDetailsPresenter } from '@/infra/http/presenters/item-details-presenter'

import { FetchItemUseCase } from '@/domain/item/use-cases/fetch-item'
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

@Controller('/items')
export class FetchItemController {
    constructor(private fetchItem: FetchItemUseCase) { }

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @CurrentUser() user: UserPayload,
    ) {

        const business = user.bus
        const result = await this.fetchItem.execute({
            page,
            businessId: business,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const items = result.value.item

        return { items: items.map(ItemDetailsPresenter.toHttp) }
    }
}
