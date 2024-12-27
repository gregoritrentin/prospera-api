import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateUserUseCase } from '@/domain/application/use-cases/create-user'
import { Public } from '@/infra/auth/public'
import { AppError } from '@core/error/app-errors'
import { createZodDto } from 'nestjs-zod'

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  password: z.string(),
  defaultBusiness: z.string().optional(),
  photoFileId: z.string().optional(),
})

// Create DTO for Swagger documentation
class CreateUserRequest extends createZodDto(createUserBodySchema) { }

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@ApiTags('Users')
@Controller('/user')
@Public()
export class CreateUserController {
  constructor(private createUser: CreateUserUseCase) { }

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Create user',
    description: 'Creates a new user in the system'
  })
  @ApiBody({
    type: CreateUserRequest,
    description: 'User creation details',
    schema: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: {
          type: 'string',
          description: 'Full name of the user'
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'Email address (must be unique)'
        },
        password: {
          type: 'string',
          description: 'User password',
          minLength: 6
        },
        defaultBusiness: {
          type: 'string',
          format: 'uuid',
          description: 'Default business ID for the user',
          nullable: true
        },
        photoFileId: {
          type: 'string',
          format: 'uuid',
          description: 'ID of uploaded profile photo',
          nullable: true
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User created successfully'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Error message',
          example: 'Invalid user data'
        },
        statusCode: {
          type: 'number',
          example: 400
        }
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email already in use',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Error message',
          example: 'Email already in use'
        },
        statusCode: {
          type: 'number',
          example: 409
        }
      }
    }
  })
  async handle(@Body(new ZodValidationPipe(createUserBodySchema)) body: CreateUserBodySchema) {
    const {
      name,
      email,
      phone,
      password,
      defaultBusiness,
      photoFileId,
    } = body

    const result = await this.createUser.execute({
      name,
      email,
      phone,
      password,
      defaultBusiness: defaultBusiness || undefined,
      photoFileId: photoFileId || undefined,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AppError.uniqueConstraintViolation:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { message: 'User created successfully' }
  }
}