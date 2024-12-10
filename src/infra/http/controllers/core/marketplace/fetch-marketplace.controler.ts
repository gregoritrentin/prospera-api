import { BadRequestException, Get, Controller, UseGuards, Query } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { MarketplacePresenter } from '@/infra/http/presenters/marketplace-presenter'
import { FetchMarketplaceUseCase } from '@/domain/application/use-cases/fetch-marketplace'
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiSecurity } from '@nestjs/swagger'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Marketplaces')
@Controller('/marketplaces')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class FetchMarketplaceController {
  constructor(private fetchMarketplaces: FetchMarketplaceUseCase) { }

  @Get()
  @ApiOperation({
    summary: 'Fetch marketplaces',
    description: 'Retrieves a paginated list of marketplaces'
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
    description: 'Marketplaces retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        marketplace: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid',
                description: 'Marketplace ID'
              },
              name: {
                type: 'string',
                description: 'Marketplace name'
              },
              document: {
                type: 'string',
                description: 'Marketplace document'
              },
              status: {
                type: 'string',
                description: 'Current status',
                enum: ['PENDING', 'ACTIVE', 'INACTIVE']
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
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token'
  })
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const result = await this.fetchMarketplaces.execute({
      page,
      businessId: '', // TODO: Considerar remover este parâmetro se não está sendo usado
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const marketplace = result.value.marketplace

    return { marketplace: marketplace.map(MarketplacePresenter.toHttp) }
  }
}