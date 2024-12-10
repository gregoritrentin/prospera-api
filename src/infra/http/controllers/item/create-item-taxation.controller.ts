import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CreateItemTaxationUseCase } from '@/domain/item/use-cases/create-item-taxation'
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const createItemTaxationSchema = z.object({
    businessId: z.string().uuid(),
    taxation: z.string(),
    status: z.string()
})

// Create DTO for Swagger documentation
class CreateItemTaxationRequestDto extends createZodDto(createItemTaxationSchema) { }

const bodyValidationPipe = new ZodValidationPipe(createItemTaxationSchema)

type CreateItemTaxationBodySchema = z.infer<typeof createItemTaxationSchema>

@ApiTags('Items')
@Controller('/items/taxation')
@ApiSecurity('bearer')
export class CreateItemTaxationController {
    constructor(private createItemTaxation: CreateItemTaxationUseCase) { }

    @Post()
    @ApiOperation({
        summary: 'Create item taxation',
        description: 'Creates a new item taxation rule for the business'
    })
    @ApiBody({
        type: CreateItemTaxationRequestDto,
        description: 'Item taxation creation details',
        schema: {
            type: 'object',
            required: ['businessId', 'taxation', 'status'],
            properties: {
                businessId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'Business ID'
                },
                taxation: {
                    type: 'string',
                    description: 'Taxation rule'
                },
                status: {
                    type: 'string',
                    description: 'Taxation status',
                    example: 'ACTIVE'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Item taxation created successfully',
        schema: {
            type: 'object',
            properties: {
                itemTaxation: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Item taxation ID'
                        },
                        businessId: {
                            type: 'string',
                            description: 'Business ID'
                        },
                        taxation: {
                            type: 'string',
                            description: 'Taxation rule'
                        },
                        status: {
                            type: 'string',
                            description: 'Taxation status'
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
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid input data',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid input data'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: CreateItemTaxationBodySchema,
    ) {
        const {
            businessId,
            taxation,
            status
        } = body

        const result = await this.createItemTaxation.execute({
            businessId,
            taxation,
            status
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        return result.value
    }
}