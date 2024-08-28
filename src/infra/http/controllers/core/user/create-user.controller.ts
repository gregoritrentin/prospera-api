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
import { CreateUserUseCase } from '@/domain/core/use-cases/create-user'
import { UserAlreadyExistsError } from '@/domain/core/use-cases/errors/user-already-exists-error'
import { Public } from '@/infra/auth/public'

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  defaultBusiness: z.string().optional(),
  photoFileId: z.string().optional(),
})

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@Controller('/user')
@Public()
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  async handle(@Body() body: CreateUserBodySchema) {
    const {
      name,
      email,
      password,
      defaultBusiness,
      photoFileId,

    } = body

    const result = await this.createUser.execute({
      name,
      email,
      password,
      defaultBusiness: defaultBusiness || undefined,
      photoFileId: photoFileId || undefined,
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