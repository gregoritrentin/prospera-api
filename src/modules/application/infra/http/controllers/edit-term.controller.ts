import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Param,
    Put,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditTermUseCase } from 'edit-term.controller'
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const editTermBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    language: z.string(),
    startAt: z.date(),
})

// Create DTO for Swagger documentation
class EditTermRequest extends createZodDto(editTermBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(editTermBodySchema)

type EditTermBodySchema = z.infer<typeof editTermBodySchema>

@ApiTags('Terms')
@Controller('/term/:id')
export class EditTermController {
    constructor(private editTerm: EditTermUseCase) { }

    @Put()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Update term',
        description: 'Updates an existing terms and conditions document'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the term to be updated',
        type: 'string',
        format: 'uuid',
        required: true
    })
    @ApiBody({
        type: EditTermRequest,
        description: 'Updated term details',
        schema: {
            type: 'object',
            required: ['title', 'content', 'language', 'startAt'],
            properties: {
                title: {
                    type: 'string',
                    description: 'New title of the term'
                },
                content: {
                    type: 'string',
                    description: 'New content of the term'
                },
                language: {
                    type: 'string',
                    description: 'Language of the term',
                    example: 'en-US'
                },
                startAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'New effective date for the term'
                }
            }
        }
    })
    @ApiResponse({
        status: 204,
        description: 'Term updated successfully'
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
    async handle(
        @Body(bodyValidationPipe) body: EditTermBodySchema,
        @Param('id') termId: string,
    ) {
        const {
            title,
            content,
            language,
            startAt,
        } = body

        const result = await this.editTerm.execute({
            termId,
            title,
            content,
            language,
            startAt,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}