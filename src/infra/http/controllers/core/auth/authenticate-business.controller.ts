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
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
  businessId: z.string(),
})

// Create DTO for Swagger documentation
class AuthenticateBusinessRequest extends createZodDto(authenticateBodySchema) { }

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@ApiTags('Authentication')
@Controller('/auth/business')
@Public()
export class AuthenticateBusinessController {
  constructor(private authenticateBusiness: AuthenticateBusinessUseCase) { }

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  @ApiOperation({
    summary: 'Authenticate business user',
    description: 'Authenticates a business user and returns a JWT access token'
  })
  @ApiBody({
    type: AuthenticateBusinessRequest,
    description: 'Business user credentials and business ID'
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
    const { email, password, businessId } = body

    const result = await this.authenticateBusiness.execute({
      email,
      password,
      businessId,
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