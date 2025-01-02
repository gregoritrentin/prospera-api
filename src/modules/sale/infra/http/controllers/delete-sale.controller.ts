import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
import { DeleteSaleUseCase } from 'delete-sale.controller'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiSecurity } from '@nestjs/swagger'

@ApiTags('Sales')
@Controller('/sale/:id')
@ApiSecurity('bearer')
export class DeletePersonController {
    constructor(private deleteSale: DeleteSaleUseCase) { }

    @Delete()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Delete sale',
        description: 'Deletes a specific sale record by ID'
    })
    @ApiParam({
        name: 'id',
        description: 'Sale ID to be deleted',
        type: 'string',
        required: true
    })
    @ApiResponse({
        status: 204,
        description: 'Sale deleted successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid sale ID or unauthorized access',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid sale ID or unauthorized access'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') saleId: string,
    ) {
        const businessId = user.bus

        const result = await this.deleteSale.execute({
            businessId: businessId,
            saleId: saleId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}