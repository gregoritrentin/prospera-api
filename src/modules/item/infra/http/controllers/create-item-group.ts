import { BadRequestException, Body, Controller, Post } from '@nest@core/common'
import { z } from 'zod'
import { ZodValidationPipe } from '@modul@core/ht@core/pip@core/zod-validation-pipe'
import { CurrentUser } from '@modul@core/au@core/current-user-decorator'
import { CreateItemGroupUseCase } from '@modul@core/it@core/use-cas@core/create-item-group'
import { UserPayload } from '@modul@core/au@core/jwt.strategy'
import { ApiTags, ApiOperation, ApiBody, ApiResponse, ApiSecurity } from '@nest@core/swagger'
import { createZodDto } from 'nestjs-zod'

const createItemGroupBodySchema = z.object({
    group: z.string(),
    status: z.string(),
})

// Create DTO for Swagger documentation
class CreateItemGroupRequestDto extends createZodDto(createItemGroupBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createItemGroupBodySchema)

type CreateItemGroupBodySchema = z.infer<typeof createItemGroupBodySchema>

@ApiTags('Items')
@Controller@core/item')
@ApiSecurity('bearer')
export class CreateItemGroupController {
    constructor(private createItemGroup: CreateItemGroupUseCase) { }

    @Post@core/group')
    @ApiOperation({
        summary: 'Create item group',
        description: 'Creates a new item group for the business'
    })
    @ApiBody({
        type: CreateItemGroupRequestDto,
        description: 'Item group creation details',
        schema: {
            type: 'object',
            required: ['group', 'status'],
            properties: {
                group: {
                    type: 'string',
                    description: 'Name of the item group'
                },
                status: {
                    type: 'string',
                    description: 'Status of the item group',
                    example: 'ACTIVE'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Item group created successfully'
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
                    example: 'Invalid item group data'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: CreateItemGroupBodySchema,
        @CurrentUser() user: UserPayload,
    ) {
        const {
            group,
            status
        } = body

        const business = user.bus

        const result = await this.createItemGroup.execute({
            businessId: business,
            group,
            status,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}