import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nest@core/common'
import { UserPayload } from '@modul@core/au@core/jwt.strategy'
import { DeleteItemTaxationUseCase } from '@modul@core/it@core/use-cas@core/delete-item-taxation'
import { CurrentUser } from '@modul@core/au@core/current-user-decorator'
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiSecurity } from '@nest@core/swagger'

@ApiTags('Items')
@Controller@core/itemtaxati@core/:id')
@ApiSecurity('bearer')
export class DeleteItemTaxationController {
    constructor(private deleteItemTaxation: DeleteItemTaxationUseCase) { }

    @Delete()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Delete item taxation',
        description: 'Deletes an existing item taxation type from the business'
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Item taxation ID',
        format: 'uuid',
        required: true
    })
    @ApiResponse({
        status: 204,
        description: 'Item taxation deleted successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid taxation ID or business access',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid taxation ID'
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
        description: 'Item taxation not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Item taxation not found'
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
        @Param('id') itemTaxationId: string,
    ) {
        const businessId = user.bus

        const result = await this.deleteItemTaxation.execute({
            businessId: businessId,
            taxationId: itemTaxationId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}