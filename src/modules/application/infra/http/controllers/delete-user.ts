import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { DeleteUserUseCase } from '@/domain/application/use-cases/delete-user'
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('/user/:id')
export class DeleteUserController {
    constructor(private deleteUser: DeleteUserUseCase) { }

    @Delete()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Delete user',
        description: 'Removes a user from the system'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the user to be deleted',
        type: 'string',
        format: 'uuid',
        required: true
    })
    @ApiResponse({
        status: 204,
        description: 'User deleted successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid user ID',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid user ID'
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
        description: 'User not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'User not found'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    async handle(@Param('id') userId: string) {
        const result = await this.deleteUser.execute({
            userId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}