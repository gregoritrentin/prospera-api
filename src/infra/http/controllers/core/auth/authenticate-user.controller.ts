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
import { AuthenticateUserUseCase } from '@/domain/application/use-cases/authenticate-user'
import { Public } from '@/infra/auth/public'
import { AppError } from '@/core/errors/app-errors'
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Create DTO for Swagger documentation
class AuthenticateUserRequest extends createZodDto(authenticateBodySchema) { }

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@ApiTags('Authentication')
@Controller('/auth')
@Public()
export class AuthenticateUserController {
  constructor(private authenticateUser: AuthenticateUserUseCase) { }

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  @ApiOperation({
    summary: 'Authenticate user',
    description: 'Authenticates a user and returns a JWT access token'
  })
  @ApiBody({
    type: AuthenticateUserRequest,
    description: 'User credentials'
  })
  @ApiResponse({
    status: 201,
    description: 'Authentication successful',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          description: 'JWT access token',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Error message',
          example: 'Invalid credentials'
        },
        statusCode: {
          type: 'number',
          example: 401
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
          description: 'Error message'
        },
        statusCode: {
          type: 'number',
          example: 400
        }
      }
    }
  })
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateUser.execute({
      email,
      password,
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