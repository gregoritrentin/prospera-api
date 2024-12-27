import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { DeleteTermUseCase } from '@/domain/application/use-cases/delete-term'
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'

@ApiTags('Terms')
@Controller('/term/:id')
export class DeleteTermController {
    constructor(private deleteTerm: DeleteTermUseCase) { }

    @Delete()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Delete term',
        description: 'Removes an existing terms and conditions document'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the term to be deleted',
        type: 'string',
        format: 'uuid',
        required: true
    })
    @ApiResponse({
        status: 204,
        description: 'Term deleted successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid term ID',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid term ID'
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
        description: 'Term not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Term not found'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    async handle(@Param('id') termId: string) {
        const result = await this.deleteTerm.execute({
            termId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}