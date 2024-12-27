import { BadRequestException, Get, Controller, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { PersonDetailsPresenter } from '@/infra/http/presenters/person-details-presenter'
import { FetchPersonUseCase } from '@/domain/person/use-cases/fetch-person'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiSecurity } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

// Create DTO for Swagger documentation
class PageQueryParamDto extends createZodDto(pageQueryParamSchema) { }

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Person')
@Controller('/person')
@ApiSecurity('bearer')
export class FetchPersonController {
  constructor(private fetchPerson: FetchPersonUseCase) { }

  @Get()
  @ApiOperation({
    summary: 'Fetch persons',
    description: 'Retrieves a paginated list of persons for the business'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (starts at 1)',
    type: 'number',
    example: 1,
    schema: {
      default: 1,
      minimum: 1
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Persons retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        persons: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'Person ID'
              },
              name: {
                type: 'string',
                description: 'Full name'
              },
              email: {
                type: 'string',
                description: 'Email address'
              },
              phone: {
                type: 'string',
                description: 'Phone number'
              },
              document: {
                type: 'string',
                description: 'Identification document'
              },
              address: {
                type: 'object',
                properties: {
                  line1: {
                    type: 'string',
                    description: 'First line of address'
                  },
                  line2: {
                    type: 'string',
                    description: 'Second line of address'
                  },
                  line3: {
                    type: 'string',
                    description: 'Third line of address'
                  },
                  neighborhood: {
                    type: 'string',
                    description: 'Neighborhood'
                  },
                  postalCode: {
                    type: 'string',
                    description: 'Postal/ZIP code'
                  },
                  countryCode: {
                    type: 'string',
                    description: 'Country code'
                  },
                  stateCode: {
                    type: 'string',
                    description: 'State/Province code'
                  },
                  cityCode: {
                    type: 'string',
                    description: 'City code'
                  }
                }
              },
              status: {
                type: 'string',
                description: 'Person status'
              },
              notes: {
                type: 'string',
                description: 'Additional notes'
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid page number',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Error message',
          example: 'Invalid page number'
        },
        statusCode: {
          type: 'number',
          example: 400
        }
      }
    }
  })
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const business = user.bus
    const result = await this.fetchPerson.execute({
      page,
      businessId: business,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const persons = result.value.person

    return { persons: persons.map(PersonDetailsPresenter.toHttp) }
  }
}