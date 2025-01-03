import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditItemGroupUseCase } from '@/domain/item/use-cases/edit-item-group'
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse, ApiSecurity } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const editItemGroupBodySchema = z.object({
    group: z.string(),
    status: z.string(),
})

// Create DTO for Swagger documentation
class EditItemGroupRequestDto extends createZodDto(editItemGroupBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(editItemGroupBodySchema)

type EditItemGroupBodySchema = z.infer<typeof editItemGroupBodySchema>

@ApiTags('Items')
@Controller('/itemgroup/:id')
@ApiSecurity('bearer')
export class EditItemGroupController {
    constructor(private editItemGroup: EditItemGroupUseCase) { }

    @Put()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Edit item group',
        description: 'Updates an existing item group in the business'
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Item group ID',
        format: 'uuid',
        required: true
    })
    @ApiBody({
        type: EditItemGroupRequestDto,
        description: 'Item group update details',
        schema: {
            type: 'object',
            required: ['group', 'status'],
            properties: {
                group: {
                    type: 'string',
                    description: 'Updated group name',
                    example: 'Electronics'
                },
                status: {
                    type: 'string',
                    description: 'Updated group status',
                    example: 'ACTIVE'
                }
            }
        }
    })
    @ApiResponse({
        status: 204,
        description: 'Item group updated successfully'
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
                    example: 'Invalid group data'
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
        description: 'Item group not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Item group not found'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: EditItemGroupBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') groupId: string,
    ) {
        const {
            group,
            status,
        } = body

        const businessId = user.bus

        const result = await this.editItemGroup.execute({
            businessId: businessId,
            groupId: groupId,
            group: group,
            status: status,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}