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
import { Request } from 'express'
import { z } from 'zod'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { EditSubscriptionUseCase } from 'edit-subscription.controller'
import { Language } from '@/i18n'
import { SubscriptionStatus } from '@/core/utils/enums'
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity, ApiParam, ApiHeader } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const subscriptionItemSchema = z.object({
    itemId: z.string(),
    itemDescription: z.string(),
    quantity: z.number().positive(),
    unitPrice: z.number().nonnegative(),
    totalPrice: z.number().nonnegative(),
    status: z.string(),
});

const subscriptionSplitSchema = z.object({
    recipientId: z.string(),
    splitType: z.string(),
    amount: z.number().nonnegative(),
    feeAmount: z.number().nonnegative(),
});

const subscriptionNFSeSchema = z.object({
    serviceCode: z.string(),
    issRetention: z.boolean(),
    inssRetention: z.boolean(),
    inssRate: z.number().nonnegative(),
    incidendeState: z.string(),
    indicendeCity: z.string(),
    retentionState: z.string(),
    retentionCity: z.string(),
    status: z.string(),
});

const editSubscriptionSchema = z.object({
    businessId: z.string(),
    personId: z.string(),
    price: z.number().nonnegative(),
    notes: z.string().optional(),
    paymentMethod: z.string(),
    status: z.nativeEnum(SubscriptionStatus),
    nextBillingDate: z.coerce.date(),
    nextAdjustmentDate: z.coerce.date().optional(),
    interval: z.string(),
    cancellationReason: z.string().optional(),
    cancellationDate: z.coerce.date().optional(),
    cancellationScheduledDate: z.coerce.date().optional(),
    items: z.array(subscriptionItemSchema),
    splits: z.array(subscriptionSplitSchema).optional(),
    nfse: subscriptionNFSeSchema.optional(),
});

// Create DTOs for Swagger documentation
class SubscriptionItemDto extends createZodDto(subscriptionItemSchema) { }
class SubscriptionSplitDto extends createZodDto(subscriptionSplitSchema) { }
class SubscriptionNFSeDto extends createZodDto(subscriptionNFSeSchema) { }
class EditSubscriptionRequestDto extends createZodDto(editSubscriptionSchema) { }

type EditSubscriptionBody = z.infer<typeof editSubscriptionSchema>

@ApiTags('Subscriptions')
@Controller('/subscriptions/:id')
@ApiSecurity('bearer')
export class EditSubscriptionController {
    constructor(
        private editSubscription: EditSubscriptionUseCase,
    ) { }

    @Put()
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(editSubscriptionSchema))
    @ApiOperation({
        summary: 'Edit subscription',
        description: 'Updates an existing subscription with new information'
    })
    @ApiParam({
        name: 'id',
        description: 'Subscription ID',
        type: 'string',
        required: true
    })
    @ApiHeader({
        name: 'accept-language',
        required: false,
        description: 'Language for response messages (default: en-US)',
    })
    @ApiBody({
        type: EditSubscriptionRequestDto,
        description: 'Subscription update details',
        schema: {
            type: 'object',
            required: [
                'businessId',
                'personId',
                'price',
                'paymentMethod',
                'status',
                'nextBillingDate',
                'interval',
                'items'
            ],
            properties: {
                businessId: {
                    type: 'string',
                    description: 'Business ID'
                },
                personId: {
                    type: 'string',
                    description: 'Person/Customer ID'
                },
                price: {
                    type: 'number',
                    minimum: 0,
                    description: 'Subscription price'
                },
                notes: {
                    type: 'string',
                    description: 'Additional notes',
                },
                paymentMethod: {
                    type: 'string',
                    description: 'Payment method'
                },
                status: {
                    type: 'string',
                    enum: Object.values(SubscriptionStatus),
                    description: 'Subscription status'
                },
                nextBillingDate: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Next billing date'
                },
                nextAdjustmentDate: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Next adjustment date'
                },
                interval: {
                    type: 'string',
                    description: 'Billing interval'
                },
                cancellationReason: {
                    type: 'string',
                    description: 'Reason for cancellation'
                },
                cancellationDate: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Cancellation date'
                },
                cancellationScheduledDate: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Scheduled cancellation date'
                },
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['itemId', 'itemDescription', 'quantity', 'unitPrice', 'totalPrice', 'status'],
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
                                description: 'Quantity'
                            },
                            unitPrice: {
                                type: 'number',
                                minimum: 0,
                                description: 'Price per unit'
                            },
                            totalPrice: {
                                type: 'number',
                                minimum: 0,
                                description: 'Total price'
                            },
                            status: {
                                type: 'string',
                                description: 'Item status'
                            }
                        }
                    }
                },
                splits: {
                    type: 'array',
                    items: {
                        type: 'object',
                        required: ['recipientId', 'splitType', 'amount', 'feeAmount'],
                        properties: {
                            recipientId: {
                                type: 'string',
                                description: 'Recipient ID'
                            },
                            splitType: {
                                type: 'string',
                                description: 'Type of split'
                            },
                            amount: {
                                type: 'number',
                                minimum: 0,
                                description: 'Split amount'
                            },
                            feeAmount: {
                                type: 'number',
                                minimum: 0,
                                description: 'Fee amount'
                            }
                        }
                    }
                },
                nfse: {
                    type: 'object',
                    properties: {
                        serviceCode: {
                            type: 'string',
                            description: 'Service code'
                        },
                        issRetention: {
                            type: 'boolean',
                            description: 'ISS retention flag'
                        },
                        inssRetention: {
                            type: 'boolean',
                            description: 'INSS retention flag'
                        },
                        inssRate: {
                            type: 'number',
                            minimum: 0,
                            description: 'INSS rate'
                        },
                        incidendeState: {
                            type: 'string',
                            description: 'State of incidence'
                        },
                        indicendeCity: {
                            type: 'string',
                            description: 'City of incidence'
                        },
                        retentionState: {
                            type: 'string',
                            description: 'State of retention'
                        },
                        retentionCity: {
                            type: 'string',
                            description: 'City of retention'
                        },
                        status: {
                            type: 'string',
                            description: 'NFSe status'
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Subscription updated successfully',
        schema: {
            type: 'object',
            properties: {
                subscription: {
                    type: 'object',
                    description: 'Updated subscription details'
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
    async handle(
        @Body() body: EditSubscriptionBody,
        @Param('id') subscriptionId: string,
        @Req() req: Request
    ) {
        const language = ((req.headers['accept-language'] as string) || 'en-US') as Language;

        const { items, splits, nfse, ...subscriptionData } = body;

        const result = await this.editSubscription.execute({
            subscriptionId,
            ...subscriptionData,
            items,
            splits: splits || [],
            nfse: nfse || undefined,
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
            subscription: result.value.subscription,
            message: result.value.message,
        };
    }
}