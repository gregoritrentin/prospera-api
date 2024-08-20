import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateUserBusinessUseCase } from '@/domain/user/use-cases/create-user-business'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'


const createUserBusinessBodySchema = z.object({
  userId: z.string(),
  role: z.string(),
  isDefaultBusiness: z.boolean(),
})

const bodyValidationPipe = new ZodValidationPipe(createUserBusinessBodySchema)

type CreateUserBusinessBodySchema = z.infer<typeof createUserBusinessBodySchema>

@Controller('/user/business')
export class CreateUserBusinessController {
  constructor(private createUserBusiness: CreateUserBusinessUseCase) { }

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateUserBusinessBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const {

      userId,
      role,

    } = body

    const business = user.bus

    const result = await this.createUserBusiness.execute({
      businessId: business,
      userId,
      role,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
