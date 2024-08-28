import { BadRequestException, Get, Controller, UseGuards, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { UserBusinessDetailsPresenter } from '@/infra/http/presenters/user-business-details-presenter'
import { FetchUserBusinessUseCase } from '@/domain/core/use-cases/fetch-user-business'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/user/business')
export class FetchUserBusinessController {
  constructor(private fetchUserBusiness: FetchUserBusinessUseCase) { }

  @Get()
  async handle(
    @Query('userID', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,

  ) {

    const businessId = user.bus
    const userId = user.sub

    const result = await this.fetchUserBusiness.execute({
      userId: userId,
      businessId: businessId,

    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const userBusiness = result.value.userBusiness

    return { userBusiness: userBusiness.map(UserBusinessDetailsPresenter.toHttp) }
  }
}