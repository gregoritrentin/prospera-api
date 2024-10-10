import { BadRequestException, Get, Controller, UseGuards, Query } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { MarketplacePresenter } from '@/infra/http/presenters/marketplace-presenter'
import { FetchMarketplaceUseCase } from '@/domain/application/use-cases/fetch-marketplace'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/marketplaces')
@UseGuards(JwtAuthGuard)
export class FetchMarketplaceController {
  constructor(private fetchMarketplaces: FetchMarketplaceUseCase) { }

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {

    const result = await this.fetchMarketplaces.execute({
      page,
      businessId: '',
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const marketplace = result.value.marketplace

    return { marketplace: marketplace.map(MarketplacePresenter.toHttp) }
  }
}