import {
    BadRequestException,
    Controller,
    Param,
    Get,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { GetSaleUseCase } from '@/domain/sale/use-cases/get-sale'
import { SalePresenter } from '@/infra/http/presenters/sale-presenter'
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiSecurity } from '@nestjs/swagger'

@ApiTags('Sales')
@Controller('/sale/:id')
@ApiSecurity('bearer')
export class GetSaleController {
    constructor(private getSale: GetSaleUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Get sale',
        description: 'Retrieves a specific sale details by ID'
    })
    @ApiParam({
        name: 'id',
        description: 'Sale ID',
        type: 'string',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'Sale retrieved successfully',
        schema: {
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
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid sale ID or unauthorized access',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid sale ID or unauthorized access'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') saleId: string,
    ) {
        const businessId = user.bus

        const result = await this.getSale.execute({
            businessId: businessId,
            saleId: saleId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const sale = result.value.sale

        return SalePresenter.toHttp(sale)
    }
}