import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateUserUseCase } from '@/domain/user/use-cases/create-user'
import { UserAlreadyExistsError } from '@/domain/user/use-cases/errors/user-already-exists-error'
import { Public } from '@/infra/auth/public'

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  defaultBusiness: z.string().optional(),
})

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@Controller('/user')
@Public()
export class CreateUserController {
  constructor(private registerUser: CreateUserUseCase) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  async handle(@Body() body: CreateUserBodySchema) {
    const {
      name,
      email,
      password,
      defaultBusiness,
    } = body

    const result = await this.registerUser.execute({
      name,
      email,
      password,
      defaultBusiness: defaultBusiness || undefined,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}