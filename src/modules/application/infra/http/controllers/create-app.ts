import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateAppUseCase } from '@/domain/application/use-cases/create-app'
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'
import { AppType } from '@core/utils/enums'

// Define the validation schema for app creation
const createAppBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    quantity: z.number(),
    type: z.enum([AppType.UNIT, AppType.PERCENTAGE]),
    status: z.string(),
})

// Create DTO class for Swagger documentation
class CreateAppRequest extends createZodDto(createAppBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createAppBodySchema)

type CreateAppBodySchema = z.infer<typeof createAppBodySchema>

@ApiTags('Applications')
@Controller('/app')
export class CreateAppController {
    constructor(private createApp: CreateAppUseCase) { }

    @Post()
    @ApiOperation({
        summary: 'Create a new application',
        description: 'Create a new application with the provided details'
    })
    @ApiBody({ type: CreateAppRequest })
    @ApiResponse({ status: 201, description: 'Application created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid input data' })
    async handle(
        @Body(bodyValidationPipe) body: CreateAppBodySchema,
    ) {
        const {
            name,
            description,
            price,
            quantity,
            type,
            status
        } = body

        const result = await this.createApp.execute({
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

        return { message: 'Application created successfully' }
    }
}