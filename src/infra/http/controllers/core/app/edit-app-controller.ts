import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditAppUseCase } from '@/domain/application/use-cases/edit-app'
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'
import { AppType } from '@/core/types/enums'

const editAppBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    quantity: z.number(),
    type: z.enum([AppType.UNIT, AppType.PERCENTAGE]),
    status: z.string(),
})

// Create DTO for Swagger documentation
class EditAppRequest extends createZodDto(editAppBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(editAppBodySchema)

type EditAppBodySchema = z.infer<typeof editAppBodySchema>

@ApiTags('Applications')
@Controller('/app/:id')
export class EditAppController {
    constructor(private editApp: EditAppUseCase) { }

    @Put()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Edit an application',
        description: 'Updates an existing application with the provided details'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the application to be updated',
        type: 'string',
        required: true
    })
    @ApiBody({ type: EditAppRequest })
    @ApiResponse({
        status: 204,
        description: 'Application updated successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid input data or application not found'
    })
    async handle(
        @Body(bodyValidationPipe) body: EditAppBodySchema,
        @Param('id') appId: string,
    ) {
        const {
            name,
            description,
            price,
            quantity,
            type,
            status,
        } = body

        const result = await this.editApp.execute({
            appId,
            name,
            description,
            price,
            quantity,
            type,
            status,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}