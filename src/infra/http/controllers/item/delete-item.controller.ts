import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteItemUseCase } from '@/domain/item/use-cases/delete-item'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiSecurity } from '@nestjs/swagger'

@ApiTags('Items')
@Controller('/item/:id')
@ApiSecurity('bearer')
export class DeleteItemController {
    constructor(private deleteItem: DeleteItemUseCase) { }

    @Delete()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Delete item',
        description: 'Deletes an existing item from the business catalog'
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Item ID',
        format: 'uuid',
        required: true
    })
    @ApiResponse({
        status: 204,
        description: 'Item deleted successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid item ID or business access',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid item ID'
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
        @CurrentUser() user: UserPayload,
        @Param('id') itemId: string,
    ) {
        const businessId = user.bus

        const result = await this.deleteItem.execute({
            businessId: businessId,
            itemId: itemId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}