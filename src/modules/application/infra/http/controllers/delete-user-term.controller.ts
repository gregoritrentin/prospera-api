import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { DeleteUserTermUseCase } from 'delete-user-term.controller'
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'

@ApiTags('Terms')
@Controller('/user/term/:id')
export class DeleteUserTermController {
    constructor(private deleteTerm: DeleteUserTermUseCase) { }

    @Delete()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Delete user term acceptance',
        description: 'Removes a record of user acceptance for specific terms'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the user term acceptance record',
        type: 'string',
        format: 'uuid',
        required: true
    })
    @ApiResponse({
        status: 204,
        description: 'User term acceptance record deleted successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid user term ID',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid user term ID'
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
        description: 'User term acceptance record not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'User term acceptance record not found'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    async handle(@Param('id') userTermId: string) {
        const result = await this.deleteTerm.execute({
            userTermId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}