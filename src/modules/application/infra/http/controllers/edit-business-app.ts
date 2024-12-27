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
import { EditBusinessAppUseCase } from '@/domain/application/use-cases/edit-business-app'
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const editBusinessAppBodySchema = z.object({
    quantity: z.number(),
    price: z.number(),
})

// Create DTO for Swagger documentation
class EditBusinessAppRequest extends createZodDto(editBusinessAppBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(editBusinessAppBodySchema)

type EditBusinessAppBodySchema = z.infer<typeof editBusinessAppBodySchema>

@ApiTags('Business Applications')
@Controller('/business/app/:id')
export class EditBusinessAppController {
    constructor(private editBusinessApp: EditBusinessAppUseCase) { }

    @Put()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Update business app',
        description: 'Updates the quantity and price of an existing business application association'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the business app association',
        type: 'string',
        format: 'uuid',
        required: true
    })
    @ApiBody({
        type: EditBusinessAppRequest,
        description: 'Updated business app details',
        schema: {
            type: 'object',
            required: ['quantity', 'price'],
            properties: {
                quantity: {
                    type: 'number',
                    description: 'New quantity of the application',
                    minimum: 0,
                    example: 5
                },
                price: {
                    type: 'number',
                    description: 'New price of the application',
                    minimum: 0,
                    example: 99.99
                }
            }
        }
    })
    @ApiResponse({
        status: 204,
        description: 'Business app updated successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid input data',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid quantity or price'
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
        description: 'Business app association not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Business app not found'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: EditBusinessAppBodySchema,
        @Param('id') businessAppId: string,
    ) {
        const {
            quantity,
            price
        } = body

        const result = await this.editBusinessApp.execute({
            businessAppId,
            price,
            quantity,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}