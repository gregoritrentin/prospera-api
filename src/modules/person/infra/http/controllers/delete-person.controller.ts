import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
import { DeletePersonUseCase } from 'delete-person.controller'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiSecurity } from '@nestjs/swagger'

@ApiTags('Person')
@Controller('/person/:id')
@ApiSecurity('bearer')
export class DeletePersonController {
    constructor(private deletePerson: DeletePersonUseCase) { }

    @Delete()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Delete person',
        description: 'Deletes a person record from the business'
    })
    @ApiParam({
        name: 'id',
        description: 'Person ID',
        type: 'string',
        required: true
    })
    @ApiResponse({
        status: 204,
        description: 'Person deleted successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid person ID or unauthorized access',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid person ID or unauthorized access'
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
        @Param('id') personId: string,
    ) {
        const businessId = user.bus

        const result = await this.deletePerson.execute({
            businessId: businessId,
            personId: personId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}