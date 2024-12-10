import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteItemGroupUseCase } from '@/domain/item/use-cases/delete-item-group'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiSecurity } from '@nestjs/swagger'

@ApiTags('Items')
@Controller('/itemgroup/:id')
@ApiSecurity('bearer')
export class DeleteItemGroupController {
    constructor(private deleteItemGroup: DeleteItemGroupUseCase) { }

    @Delete()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Delete item group',
        description: 'Deletes an existing item group from the business'
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Item group ID',
        format: 'uuid',
        required: true
    })
    @ApiResponse({
        status: 204,
        description: 'Item group deleted successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid item group ID or business access',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid item group ID'
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
        @CurrentUser() user: UserPayload,
        @Param('id') itemGroupId: string,
    ) {
        const businessId = user.bus

        const result = await this.deleteItemGroup.execute({
            businessId: businessId,
            groupId: itemGroupId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}