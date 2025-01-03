import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
    Req,
    UsePipes,
} from '@nestjs/common'
import { Request } from 'express';
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { EditSaleUseCase } from '@/domain/sale/use-cases/edit-sale'
import { Language } from '@/i18n';
import { SaleStatus } from '@/core/types/enums';
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity, ApiParam, ApiHeader } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const saleItemSchema = z.object({
    itemId: z.string(),
    itemDescription: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative(),
    discountAmount: z.number().nonnegative(),
    commissionAmount: z.number().nonnegative(),
});

const editSaleSchema = z.object({
    businessId: z.string(),
    customerId: z.string().optional(),
    ownerId: z.string(),
    salesPersonId: z.string(),
    channelId: z.string().optional(),
    status: z.nativeEnum(SaleStatus),
    notes: z.string().optional(),
    servicesAmount: z.number().nonnegative(),
    productAmount: z.number().nonnegative(),
    grossAmount: z.number().nonnegative(),
    discountAmount: z.number().nonnegative(),
    amount: z.number().nonnegative(),
    commissionAmount: z.number().nonnegative(),
    shippingAmount: z.number().nonnegative(),
    items: z.array(saleItemSchema).nonempty(),
});

// Create DTOs for Swagger documentation
class SaleItemRequestDto extends createZodDto(saleItemSchema) { }
class EditSaleRequestDto extends createZodDto(editSaleSchema) { }

type EditSaleBody = z.infer<typeof editSaleSchema>

@ApiTags('Sales')
@Controller('/sales/:id')
@ApiSecurity('bearer')
export class EditSaleController {
    constructor(
        private editSale: EditSaleUseCase,
    ) { }

    @Put()
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(editSaleSchema))
    @ApiOperation({
        summary: 'Edit sale',
        description: 'Updates an existing sale record with new information'
    })
    @ApiParam({
        name: 'id',
        description: 'Sale ID to be updated',
        type: 'string',
        required: true
    })
    @ApiHeader({
        name: 'accept-language',
        required: false,
        description: 'Language for response messages (default: en-US)',
    })
    @ApiBody({
        type: EditSaleRequestDto,
        description: 'Sale update details',
        schema: {
            type: 'object',
            required: [
                'businessId',
                'ownerId',
                'salesPersonId',
                'status',
                'servicesAmount',
                'productAmount',
                'grossAmount',
                'discountAmount',
                'amount',
                'commissionAmount',
                'shippingAmount',
                'items'
            ],
            properties: {
                businessId: {
                    type: 'string',
                    description: 'Business ID'
                },
                customerId: {
                    type: 'string',
                    description: 'Customer ID (optional)'
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
                    description: 'Sales channel ID (optional)'
                },
                status: {
                    type: 'string',
                    enum: Object.values(SaleStatus),
                    description: 'Updated sale status'
                },
                notes: {
                    type: 'string',
                    description: 'Additional notes (optional)'
                },
                servicesAmount: {
                    type: 'number',
                    minimum: 0,
                    description: 'Total amount for services'
                },
                productAmount: {
                    type: 'number',
                    minimum: 0,
                    description: 'Total amount for products'
                },
                grossAmount: {
                    type: 'number',
                    minimum: 0,
                    description: 'Gross amount before discounts'
                },
                discountAmount: {
                    type: 'number',
                    minimum: 0,
                    description: 'Total discount amount'
                },
                amount: {
                    type: 'number',
                    minimum: 0,
                    description: 'Final amount after discounts'
                },
                commissionAmount: {
                    type: 'number',
                    minimum: 0,
                    description: 'Total commission amount'
                },
                shippingAmount: {
                    type: 'number',
                    minimum: 0,
                    description: 'Shipping cost'
                },
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: [
                            'itemId',
                            'itemDescription',
                            'quantity',
                            'unitPrice',
                            'discountAmount',
                            'commissionAmount'
                        ],
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
                                minimum: 1,
                                description: 'Quantity of items'
                            },
                            unitPrice: {
                                type: 'number',
                                minimum: 0,
                                description: 'Price per unit'
                            },
                            discountAmount: {
                                type: 'number',
                                minimum: 0,
                                description: 'Discount amount for this item'
                            },
                            commissionAmount: {
                                type: 'number',
                                minimum: 0,
                                description: 'Commission amount for this item'
                            }
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Sale updated successfully',
        schema: {
            type: 'object',
            properties: {
                sale: {
                    type: 'object',
                    description: 'Updated sale details'
                },
                message: {
                    type: 'string',
                    description: 'Success message'
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid input data',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message'
                },
                code: {
                    type: 'string',
                    description: 'Error code'
                },
                details: {
                    type: 'object',
                    description: 'Additional error details'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    async handle(@Body() body: EditSaleBody, @Param('id') saleId: string, @Req() req: Request) {
        const language = ((req.headers['accept-language'] as string) || 'en-US') as Language;

        const { items, ...saleData } = body;

        const result = await this.editSale.execute({
            saleId,
            ...saleData,
            items,
        }, language);

        if (result.isLeft()) {
            const error = result.value;
            throw new BadRequestException({
                message: error.message,
                code: error.errorCode,
                details: error.details,
            });
        }

        return {
            sale: result.value.sale,
            message: result.value.message,
        };
    }
}