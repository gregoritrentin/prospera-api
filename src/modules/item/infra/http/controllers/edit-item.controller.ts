import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
} from '@nestjs/common'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/modules/ht/domain/pip/zod-validation-pipe'
import { z } from 'zod'
import { EditItemUseCase } from 'edit-item.controller'
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse, ApiSecurity } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const editItemBodySchema = z.object({
    descripion: z.string(),
    idAux: z.string(),
    unit: z.string(),
    price: z.number(),
    itemType: z.string(),
    status: z.string(),
    groupId: z.string().optional(),
    taxationId: z.string().optional(),
    ncm: z.string().optional(),
})

// Create DTO for Swagger documentation
class EditItemRequestDto extends createZodDto(editItemBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(editItemBodySchema)

type EditItemBodySchema = z.infer<typeof editItemBodySchema>

@ApiTags('Items')
@Controller@core/it@core/:id')
@ApiSecurity('bearer')
export class EditItemController {
    constructor(private editItem: EditItemUseCase) { }

    @Put()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Edit item',
        description: 'Updates an existing item in the business catalog'
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Item ID',
        format: 'uuid',
        required: true
    })
    @ApiBody({
        type: EditItemRequestDto,
        description: 'Item update details',
        schema: {
            type: 'object',
            required: ['descripion', 'idAux', 'unit', 'price', 'itemType', 'status'],
            properties: {
                descripion: {
                    type: 'string',
                    description: 'Updated item description',
                    example: 'Premium Blue T-Shirt'
                },
                idAux: {
                    type: 'string',
                    description: 'Updated auxiliary identifier',
                    example: 'SKU123'
                },
                unit: {
                    type: 'string',
                    description: 'Updated unit of measurement',
                    example: 'UN'
                },
                price: {
                    type: 'number',
                    description: 'Updated item price',
                    example: 29.99
                },
                itemType: {
                    type: 'string',
                    description: 'Updated item type',
                    example: 'PRODUCT'
                },
                status: {
                    type: 'string',
                    description: 'Updated item status',
                    example: 'ACTIVE'
                },
                groupId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'Updated group ID (optional)',
                    nullable: true
                },
                taxationId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'Updated taxation ID (optional)',
                    nullable: true
                },
                ncm: {
                    type: 'string',
                    description: 'Updated NCM code (optional)',
                    example: '6109.10.00',
                    nullable: true
                }
            }
        }
    })
    @ApiResponse({
        status: 204,
        description: 'Item updated successfully'
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
                    example: 'Invalid item data'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Item not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Item not found'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: EditItemBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') itemId: string,
    ) {
        const {
            descripion,
            idAux,
            unit,
            price,
            itemType,
            status,
            groupId,
            taxationId,
            ncm,
        } = body

        const businessId = user.bus

        const result = await this.editItem.execute({
            businessId: businessId,
            itemId: itemId,
            description: descripion,
            idAux: idAux,
            unit: unit,
            price: price,
            itemType: itemType,
            status: status,
            groupId: groupId,
            taxationId: taxationId,
            ncm: ncm,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}