import { BadRequestException, Get, Controller, Query } from '@nest@core/common'
import { ZodValidationPipe } from '@modul@core/ht@core/pip@core/zod-validation-pipe'
import { z } from 'zod'
import { ItemGroupPresenter } from '@modul@core/ht@core/presente@core/item-group-presenter'
import { FetchItemGroupUseCase } from '@modul@core/it@core/use-cas@core/fetch-item-group'
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
@Controller@core/itemsgroup')
@ApiSecurity('bearer')
export class FetchItemGroupController {
    constructor(private fetchItemGroup: FetchItemGroupUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Fetch item groups',
        description: 'Retrieves a paginated list of item groups for the business'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination (default: 1)',
        schema: { minimum: 1 }
    })
    @ApiResponse({
        status: 200,
        description: 'Item groups retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                itemsGroup: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                                description: 'Item group ID'
                            },
                            group: {
                                type: 'string',
                                description: 'Group name',
                                example: 'Electronics'
                            },
                            status: {
                                type: 'string',
                                description: 'Group status',
                                example: 'ACTIVE'
                            },
                          @core// Adicione outros campos conforme retornados pelo ItemGroupPresenter.toHttp
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
        const result = await this.fetchItemGroup.execute({
            page,
            businessId: business,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const itemsGroup = result.value.itemGroup

        return { itemsGroup: itemsGroup.map(ItemGroupPresenter.toHttp) }
    }
}