import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { CreateItemUseCase } from '@/domain/item/use-cases/create-item'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const createItemBodySchema = z.object({
    description: z.string(),
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
class CreateItemRequestDto extends createZodDto(createItemBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createItemBodySchema)

type CreateItemBodySchema = z.infer<typeof createItemBodySchema>

@ApiTags('Items')
@Controller('/item')
@ApiSecurity('bearer')
export class CreateItemController {
    constructor(private createItem: CreateItemUseCase) { }

    @Post()
    @ApiOperation({
        summary: 'Create item',
        description: 'Creates a new item in the business catalog'
    })
    @ApiBody({
        type: CreateItemRequestDto,
        description: 'Item creation details',
        schema: {
            type: 'object',
            required: ['description', 'idAux', 'unit', 'price', 'itemType', 'status'],
            properties: {
                description: {
                    type: 'string',
                    description: 'Item description or name',
                    example: 'Blue T-Shirt'
                },
                idAux: {
                    type: 'string',
                    description: 'Auxiliary identifier for the item',
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
                    description: 'Type of the item',
                    example: 'PRODUCT'
                },
                status: {
                    type: 'string',
                    description: 'Item status',
                    example: 'ACTIVE'
                },
                groupId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID of the associated item group (optional)',
                    nullable: true
                },
                taxationId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID of the associated taxation type (optional)',
                    nullable: true
                },
                ncm: {
                    type: 'string',
                    description: 'NCM code (optional)',
                    example: '6109.10.00',
                    nullable: true
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Item created successfully'
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
    async handle(
        @Body(bodyValidationPipe) body: CreateItemBodySchema,
        @CurrentUser() user: UserPayload,
    ) {
        const {
            description,
            idAux,
            unit,
            price,
            itemType,
            status,
            groupId,
            taxationId,
            ncm,
        } = body

        const business = user.bus

        const result = await this.createItem.execute({
            businessId: business,
            description,
            idAux,
            unit,
            price,
            itemType,
            status,
            groupId: groupId || null,
            taxationId: taxationId || null,
            ncm: ncm || null,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}