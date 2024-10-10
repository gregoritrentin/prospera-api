import { BadRequestException, Get, Controller, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { ItemGroupPresenter } from '@/infra/http/presenters/item-group-presenter'
import { FetchItemGroupUseCase } from '@/domain/item/use-cases/fetch-item-group'
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

@Controller('/itemsgroup')
export class FetchItemGroupController {
    constructor(private fetchItemGroup: FetchItemGroupUseCase) { }

    @Get()
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @CurrentUser() user: UserPayload,
    ) {

        const business = user.bus
        const result = await this.fetchItemGroup.execute({
            page,
            businessId: business,

        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const itemsGroup = result.value.itemGroup

        return { itemsGroup: itemsGroup.map(ItemGroupPresenter.toHttp) }
    }
}
