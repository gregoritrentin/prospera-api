import { BadRequestException, Get, Controller, UseGuards, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { UserBusinessDetailsPresenter } from '@/infra/http/presenters/user-business-details-presenter'
import { FetchUserBusinessUseCase } from '@/domain/application/use-cases/fetch-user-business'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiSecurity } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Users')
@Controller('/user/business')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class FetchUserBusinessController {
  constructor(private fetchUserBusiness: FetchUserBusinessUseCase) { }

  @Get()
  @ApiOperation({
    summary: 'Fetch user business associations',
    description: 'Retrieves all business associations for the authenticated user'
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number for pagination (minimum: 1)',
    required: false,
    type: Number,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'User business associations retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        userBusiness: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Association ID'
              },
              userId: {
                type: 'string',
                format: 'uuid',
                description: 'User ID'
              },
              businessId: {
                type: 'string',
                format: 'uuid',
                description: 'Business ID'
              },
              role: {
                type: 'string',
                description: 'User role in the business'
              },
              isDefaultBusiness: {
                type: 'boolean',
                description: 'Whether this is the default business'
              },
              status: {
                type: 'string',
                description: 'Association status'
              },
              createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'Creation timestamp'
              },
              updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'Last update timestamp'
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid page number'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const businessId = user.bus
    const userId = user.sub

    const result = await this.fetchUserBusiness.execute({
      userId,
      businessId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const userBusiness = result.value.userBusiness

    return { userBusiness: userBusiness.map(UserBusinessDetailsPresenter.toHttp) }
  }
}