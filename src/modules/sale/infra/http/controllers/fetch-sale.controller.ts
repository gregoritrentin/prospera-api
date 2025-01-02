import { BadRequestException, Get, Controller, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { SaleDetailsPresenter } from '@/modules/sale-details-presenter/infra/http/presenters/sale-details-presenter.presenter'
import { FetchSaleUseCase } from 'fetch-sale.controller'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
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

@ApiTags('Sales')
@Controller('/sale')
@ApiSecurity('bearer')
export class FetchSaleController {
    constructor(private fetchSale: FetchSaleUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Fetch sales',
        description: 'Retrieves a paginated list of sales for the business'
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
        description: 'Sales retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                sales: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                description: 'Sale ID'
                            },
                            businessId: {
                                type: 'string',
                                description: 'Business ID'
                            },
                            customerId: {
                                type: 'string',
                                description: 'Customer ID'
                            },
                            ownerId: {
                                type: 'string',
                                description: 'Owner ID'
                            },
                            salesPersonId: {
                                type: 'string',
                                description: 'Sales person ID'
                            },
                            channelId: {
                                type: 'string',
                                description: 'Sales channel ID'
                            },
                            status: {
                                type: 'string',
                                description: 'Sale status'
                            },
                            notes: {
                                type: 'string',
                                description: 'Additional notes'
                            },
                            servicesAmount: {
                                type: 'number',
                                description: 'Total services amount'
                            },
                            productAmount: {
                                type: 'number',
                                description: 'Total products amount'
                            },
                            grossAmount: {
                                type: 'number',
                                description: 'Gross amount'
                            },
                            discountAmount: {
                                type: 'number',
                                description: 'Total discount'
                            },
                            amount: {
                                type: 'number',
                                description: 'Final amount'
                            },
                            commissionAmount: {
                                type: 'number',
                                description: 'Total commission'
                            },
                            shippingAmount: {
                                type: 'number',
                                description: 'Shipping cost'
                            },
                            items: {
                                type: 'array',
                                description: 'Sale items',
                                items: {
                                    type: 'object',
                                    properties: {
                                        itemId: {
                                            type: 'string',
                                            description: 'Item ID'
                                        },
                                        itemDescription: {
                                            type: 'string',
                                            description: 'Item description'
                                        },
                                        quantity: {
                                            type: 'number',
                                            description: 'Quantity sold'
                                        },
                                        unitPrice: {
                                            type: 'number',
                                            description: 'Price per unit'
                                        },
                                        discountAmount: {
                                            type: 'number',
                                            description: 'Item discount'
                                        },
                                        commissionAmount: {
                                            type: 'number',
                                            description: 'Item commission'
                                        }
                                    }
                                }
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
        const result = await this.fetchSale.execute({
            page,
            businessId: business,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const sales = result.value.sales

        return { sales: sales.map(SaleDetailsPresenter.toHttp) }
    }
}