import {
    BadRequestException,
    Controller,
    Delete,
    HttpCode,
    Param,
} from '@nestjs/common'
import { DeleteAppUseCase } from '@/modules/application/domain/use-cases/delete-app'
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'

@ApiTags('Applications')
@Controller('/app/:id')
export class DeleteAppController {
    constructor(private deleteApp: DeleteAppUseCase) { }

    @Delete()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Delete an application',
        description: 'Removes an existing application based on the provided ID'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the application',
        type: 'string',
        required: true
    })
    @ApiResponse({
        status: 204,
        description: 'Application deleted successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid ID or application not found'
    })
    async handle(@Param('id') appId: string) {
        const result = await this.deleteApp.execute({
            appId
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}