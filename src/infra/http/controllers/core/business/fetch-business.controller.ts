import { BadRequestException, Get, Controller, UseGuards, Query } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { BusinessPresenter } from '@/infra/http/presenters/business-presenter'
import { FetchBusinessUseCase } from '@/domain/core/use-cases/fetch-business'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/business')
@UseGuards(JwtAuthGuard)
export class FetchBusinessController {
  constructor(private fetchBusiness: FetchBusinessUseCase) { }

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {

    const result = await this.fetchBusiness.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const business = result.value.business

    return { business: business.map(BusinessPresenter.toHttp) }
  }
}