import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateUserBusinessUseCase } from '@/domain/application/use-cases/create-user-business'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const createUserBusinessBodySchema = z.object({
  userId: z.string(),
  role: z.string(),
  isDefaultBusiness: z.boolean(),
})

// Create DTO for Swagger documentation
class CreateUserBusinessRequest extends createZodDto(createUserBusinessBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createUserBusinessBodySchema)

type CreateUserBusinessBodySchema = z.infer<typeof createUserBusinessBodySchema>

@ApiTags('Users')
@Controller('/user/business')
@ApiSecurity('bearer')
export class CreateUserBusinessController {
  constructor(private createUserBusiness: CreateUserBusinessUseCase) { }

  @Post()
  @ApiOperation({
    summary: 'Associate user with business',
    description: 'Creates a new association between a user and a business with specific role'
  })
  @ApiBody({
    type: CreateUserBusinessRequest,
    description: 'User business association details',
    schema: {
      type: 'object',
      required: ['userId', 'role', 'isDefaultBusiness'],
      properties: {
        userId: {
          type: 'string',
          format: 'uuid',
          description: 'ID of the user to be associated'
        },
        role: {
          type: 'string',
          description: 'Role of the user in the business',
          example: 'ADMIN'
        },
        isDefaultBusiness: {
          type: 'boolean',
          description: 'Whether this is the default business for the user',
          example: true
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'User business association created successfully'
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
          example: 'Invalid user business data'
        },
        statusCode: {
          type: 'number',
          example: 400
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'User or business not found'
  })
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

    return { message: 'User business association created successfully' }
  }
}