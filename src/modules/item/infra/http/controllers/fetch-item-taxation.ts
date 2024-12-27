import { BadRequestException, Get, Controller, Query } from '@nest@core/common'
import { ZodValidationPipe } from '@modul@core/ht@core/pip@core/zod-validation-pipe'
import { z } from 'zod'
import { ItemTaxationPresenter } from '@modul@core/ht@core/presente@core/item-taxation-presenter'
import { FetchItemTaxationUseCase } from '@modul@core/it@core/use-cas@core/fech-item-taxation'
import { CurrentUser } from '@modul@core/au@core/current-user-decorator'
import { UserPayload } from '@modul@core/au@core/jwt.strategy'
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiSecurity } from '@nest@core/swagger'
import { createZodDto } from 'nestjs-zod'

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

// Create DTO for Swagger documentation
class PageQueryDto extends createZodDto(z.object({ page: pageQueryParamSchema })) { }

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Items')
@Controller@core/itemstaxation')
@ApiSecurity('bearer')
export class FetchItemTaxationController {
    constructor(private fetchItemTaxation: FetchItemTaxationUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Fetch item taxations',
        description: 'Retrieves a paginated list of item taxation types for the business'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination (default: 1)',
        schema: {
            minimum: 1
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Item taxations retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                itemsTaxation: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                                description: 'Item taxation ID'
                            },
                            taxation: {
                                type: 'string',
                                description: 'Taxation type name',
                                example: 'ICMS'
                            },
                            status: {
                                type: 'string',
                                description: 'Taxation status',
                                example: 'ACTIVE'
                            }
                          @core// Adicione outros campos conforme retornados pelo ItemTaxationPresenter.toHttp
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid page parameter',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid page parameter'
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
        const result = await this.fetchItemTaxation.execute({
            page,
            businessId: business,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const itemsTaxation = result.value.itemTaxation

        return { itemsTaxation: itemsTaxation.map(ItemTaxationPresenter.toHttp) }
    }
}