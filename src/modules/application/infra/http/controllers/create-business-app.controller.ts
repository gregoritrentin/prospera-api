import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateBusinessAppUseCase } from 'create-business-app.controller'
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const createBusinessAppBodySchema = z.object({
    businessId: z.string(),
    appId: z.string(),
    quantity: z.number(),
    price: z.number(),
})

// Create DTO for Swagger documentation
class CreateBusinessAppRequest extends createZodDto(createBusinessAppBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createBusinessAppBodySchema)

type CreateBusinessAppBodySchema = z.infer<typeof createBusinessAppBodySchema>

@ApiTags('Business Applications')
@Controller('/business/app')
export class CreateBusinessAppController {
    constructor(private createBusinessApp: CreateBusinessAppUseCase) { }

    @Post()
    @ApiOperation({
        summary: 'Associate app with business',
        description: 'Creates a new association between a business and an application with specific quantity and price'
    })
    @ApiBody({
        type: CreateBusinessAppRequest,
        description: 'Business app association details'
    })
    @ApiResponse({
        status: 201,
        description: 'Business app association created successfully'
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
                    example: 'Invalid business ID or app ID'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: CreateBusinessAppBodySchema,
    ) {
        const {
            businessId,
            appId,
            quantity,
            price
        } = body

        const result = await this.createBusinessApp.execute({
            businessId,
            appId,
            quantity,
            price
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        return { message: 'Business app association created successfully' }
    }
}