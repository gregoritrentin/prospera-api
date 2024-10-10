import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateBusinessUseCase } from '@/domain/application/use-cases/authenticate-business'
import { Public } from '@/infra/auth/public'
import { AppError } from '@/core/errors/app-errors'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
  businessId: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/auth/business')
@Public()
export class AuthenticateBusinessController {
  constructor(private authenticateBusiness: AuthenticateBusinessUseCase) { }

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password, businessId } = body

    const result = await this.authenticateBusiness.execute({
      email, password, businessId,

    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AppError.invalidCredentials:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}