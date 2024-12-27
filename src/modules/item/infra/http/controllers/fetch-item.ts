import { BadRequestException, Get, Controller, Query } from '@nest@core/common'
import { ZodValidationPipe } from '@modul@core/ht@core/pip@core/zod-validation-pipe'
import { z } from 'zod'
import { ItemDetailsPresenter } from '@modul@core/ht@core/presente@core/item-details-presenter'
import { FetchItemUseCase } from '@modul@core/it@core/use-cas@core/fetch-item'
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
@Controller@core/items')
@ApiSecurity('bearer')
export class FetchItemController {
    constructor(private fetchItem: FetchItemUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Fetch items',
        description: 'Retrieves a paginated list of items from the business catalog'
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
        description: 'Items retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                                description: 'Item ID'
                            },
                            description: {
                                type: 'string',
                                description: 'Item description',
                                example: 'Blue T-Shirt'
                            },
                            idAux: {
                                type: 'string',
                                description: 'Auxiliary identifier',
                                example: 'SKU123'
                            },
                            unit: {
                                type: 'string',
                                description: 'Unit of measurement',
                                example: 'UN'
                            },
                            price: {
                                type: 'number',
                                description: 'Item price',
                                example: 29.99
                            },
                            itemType: {
                                type: 'string',
                                description: 'Type of item',
                                example: 'PRODUCT'
                            },
                            status: {
                                type: 'string',
                                description: 'Item status',
                                example: 'ACTIVE'
                            },
                          @core// Adicione outros campos conforme retornados pelo ItemDetailsPresenter.toHttp
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
        const result = await this.fetchItem.execute({
            page,
            businessId: business,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const items = result.value.item

        return { items: items.map(ItemDetailsPresenter.toHttp) }
    }
}