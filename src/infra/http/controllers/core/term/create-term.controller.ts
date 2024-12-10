import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateTermUseCase } from '@/domain/application/use-cases/create-term'
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const createTermBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    language: z.string(),
    startAt: z.date(),
})

// Create DTO for Swagger documentation
class CreateTermRequest extends createZodDto(createTermBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createTermBodySchema)

type CreateTermBodySchema = z.infer<typeof createTermBodySchema>

@ApiTags('Terms')
@Controller('/terms')
export class CreateTermController {
    constructor(private createTerm: CreateTermUseCase) { }

    @Post()
    @ApiOperation({
        summary: 'Create term',
        description: 'Creates a new terms and conditions document'
    })
    @ApiBody({
        type: CreateTermRequest,
        description: 'Term details',
        schema: {
            type: 'object',
            required: ['title', 'content', 'language', 'startAt'],
            properties: {
                title: {
                    type: 'string',
                    description: 'Title of the terms document'
                },
                content: {
                    type: 'string',
                    description: 'Content of the terms document'
                },
                language: {
                    type: 'string',
                    description: 'Language of the terms document',
                    example: 'en-US'
                },
                startAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Date when these terms become effective'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Term created successfully',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Term created successfully'
                }
            }
        }
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
                    example: 'Invalid term data'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: CreateTermBodySchema,
    ) {
        const {
            title,
            content,
            language,
            startAt,
        } = body

        const result = await this.createTerm.execute({
            title,
            content,
            language,
            startAt,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        return { message: 'Term created successfully' }
    }
}