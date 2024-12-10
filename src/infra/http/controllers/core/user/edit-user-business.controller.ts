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
import { EditUserBusinessUseCase } from '@/domain/application/use-cases/edit-user-business'
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const editUserBusinessBodySchema = z.object({
    role: z.string(),
    isDefaultBusiness: z.boolean(),
    status: z.string(),
})

// Create DTO for Swagger documentation
class EditUserBusinessRequest extends createZodDto(editUserBusinessBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(editUserBusinessBodySchema)

type EditUserBusinessBodySchema = z.infer<typeof editUserBusinessBodySchema>

@ApiTags('Users')
@Controller('/user/business/:id')
export class EditUserBusinessController {
    constructor(private editUser: EditUserBusinessUseCase) { }

    @Put()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Update user business association',
        description: 'Updates role, status and default business flag for a user-business association'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the user-business association',
        type: 'string',
        format: 'uuid',
        required: true
    })
    @ApiBody({
        type: EditUserBusinessRequest,
        description: 'Updated user business details',
        schema: {
            type: 'object',
            required: ['role', 'isDefaultBusiness', 'status'],
            properties: {
                role: {
                    type: 'string',
                    description: 'User role in the business',
                    example: 'ADMIN'
                },
                isDefaultBusiness: {
                    type: 'boolean',
                    description: 'Whether this is the default business for the user',
                    example: true
                },
                status: {
                    type: 'string',
                    description: 'Status of the user-business association',
                    enum: ['ACTIVE', 'INACTIVE', 'PENDING'],
                    example: 'ACTIVE'
                }
            }
        }
    })
    @ApiResponse({
        status: 204,
        description: 'User business association updated successfully'
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
                    example: 'Invalid user business data'
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
        description: 'User business association not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'User business association not found'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: EditUserBusinessBodySchema,
        @Param('id') userBusinessId: string,
    ) {
        const {
            role,
            status,
        } = body

        const result = await this.editUser.execute({
            userbusinessId: userBusinessId,
            role,
            status,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}