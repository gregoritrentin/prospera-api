import { BadRequestException, Get, Controller, UseGuards, Query } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { BusinessPresenter } from '@/infra/http/presenters/business-presenter'
import { FetchBusinessUseCase } from '@/domain/application/use-cases/fetch-business'
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiSecurity } from '@nestjs/swagger'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Business')
@Controller('/business')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class FetchBusinessController {
  constructor(private fetchBusiness: FetchBusinessUseCase) { }

  @Get()
  @ApiOperation({
    summary: 'Fetch businesses',
    description: 'Retrieves a paginated list of businesses'
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
    description: 'Businesses retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        business: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Business ID'
              },
              marketplaceId: {
                type: 'string',
                format: 'uuid',
                description: 'Marketplace ID'
              },
              name: {
                type: 'string',
                description: 'Business name'
              },
              email: {
                type: 'string',
                format: 'email',
                description: 'Business email'
              },
              phone: {
                type: 'string',
                description: 'Business phone'
              },
              document: {
                type: 'string',
                description: 'Business document'
              },
              addressLine1: {
                type: 'string',
                description: 'Primary address'
              },
              addressLine2: {
                type: 'string',
                description: 'Secondary address'
              },
              addressLine3: {
                type: 'string',
                description: 'Additional address info',
                nullable: true
              },
              neighborhood: {
                type: 'string',
                description: 'Neighborhood'
              },
              postalCode: {
                type: 'string',
                description: 'Postal code'
              },
              countryCode: {
                type: 'string',
                description: 'Country code'
              },
              stateCode: {
                type: 'string',
                description: 'State code'
              },
              cityCode: {
                type: 'string',
                description: 'City code'
              },
              businessSize: {
                type: 'string',
                description: 'Size of business'
              },
              businessType: {
                type: 'string',
                description: 'Type of business'
              },
              foundingDate: {
                type: 'string',
                format: 'date',
                description: 'Business founding date'
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
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchBusiness.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const business = result.value.business

    return { business: business.map(BusinessPresenter.toHttp) }
  }
}