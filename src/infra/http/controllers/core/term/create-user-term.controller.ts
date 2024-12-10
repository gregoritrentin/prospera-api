import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CreateUserTermUseCase } from '@/domain/application/use-cases/create-user-term'
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const createUserTermBodySchema = z.object({
    termId: z.string(),
    userId: z.string(),
    ip: z.string(),
})

// Create DTO for Swagger documentation
class CreateUserTermRequest extends createZodDto(createUserTermBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createUserTermBodySchema)

type CreateUserTermBodySchema = z.infer<typeof createUserTermBodySchema>

@ApiTags('Terms')
@Controller('/user/term')
export class CreateUserTermController {
    constructor(private createUserTerm: CreateUserTermUseCase) { }

    @Post()
    @ApiOperation({
        summary: 'Record user term acceptance',
        description: 'Records when a user accepts specific terms and conditions'
    })
    @ApiBody({
        type: CreateUserTermRequest,
        description: 'User term acceptance details',
        schema: {
            type: 'object',
            required: ['termId', 'userId', 'ip'],
            properties: {
                termId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID of the accepted terms'
                },
                userId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID of the user accepting the terms'
                },
                ip: {
                    type: 'string',
                    description: 'IP address of the user during acceptance',
                    example: '192.168.1.1'
                }
            }
        }
    })
    @ApiResponse({
        status: 201,
        description: 'Term acceptance recorded successfully',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Term acceptance recorded successfully'
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
                    example: 'Invalid user term data'
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
        description: 'Term or user not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Term or user not found'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: CreateUserTermBodySchema,
    ) {
        const {
            termId,
            userId,
            ip,
        } = body

        const result = await this.createUserTerm.execute({
            userId,
            ip,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        return { message: 'Term acceptance recorded successfully' }
    }
}