import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { DeleteBusinessUseCase } from '@/domain/application/use-cases/delete-business'
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'

@ApiTags('Business')
@Controller('/business/:id')
export class DeleteBusinessController {
    constructor(private deleteBusiness: DeleteBusinessUseCase) { }

    @Delete()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Delete business',
        description: 'Deletes an existing business and all associated data'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the business to be deleted',
        type: 'string',
        format: 'uuid',
        required: true
    })
    @ApiResponse({
        status: 204,
        description: 'Business deleted successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid business ID',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid business ID'
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
        description: 'Business not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Business not found'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    async handle(@Param('id') businessId: string) {
        const result = await this.deleteBusiness.execute({
            businessId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}