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
import { EditUserUseCase } from 'edit-user.controller'
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'

const editUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    defaultBusiness: z.string().optional(),
    photoFileId: z.string().optional(),
    status: z.string(),
})

// Create DTO for Swagger documentation
class EditUserRequest extends createZodDto(editUserBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(editUserBodySchema)

type EditUserBodySchema = z.infer<typeof editUserBodySchema>

@ApiTags('Users')
@Controller('/user/:id')
export class EditUserController {
    constructor(private editUser: EditUserUseCase) { }

    @Put()
    @HttpCode(204)
    @ApiOperation({
        summary: 'Update user',
        description: 'Updates user information including optional profile data'
    })
    @ApiParam({
        name: 'id',
        description: 'Unique identifier of the user',
        type: 'string',
        format: 'uuid',
        required: true
    })
    @ApiBody({
        type: EditUserRequest,
        description: 'Updated user details',
        schema: {
            type: 'object',
            required: ['name', 'email', 'password', 'status'],
            properties: {
                name: {
                    type: 'string',
                    description: 'Full name of the user'
                },
                email: {
                    type: 'string',
                    format: 'email',
                    description: 'Email address'
                },
                password: {
                    type: 'string',
                    description: 'User password',
                    minLength: 6
                },
                defaultBusiness: {
                    type: 'string',
                    format: 'uuid',
                    description: 'Default business ID for the user',
                    nullable: true
                },
                photoFileId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID of uploaded profile photo',
                    nullable: true
                },
                status: {
                    type: 'string',
                    description: 'User status',
                    enum: ['ACTIVE', 'INACTIVE', 'PENDING'],
                    example: 'ACTIVE'
                }
            }
        }
    })
    @ApiResponse({
        status: 204,
        description: 'User updated successfully'
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
                    example: 'Invalid user data'
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
        description: 'User not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'User not found'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    async handle(
        @Body(bodyValidationPipe) body: EditUserBodySchema,
        @Param('id') userId: string,
    ) {
        const {
            name,
            email,
            password,
            defaultBusiness,
            photoFileId,
            status,
        } = body

        const result = await this.editUser.execute({
            userId,
            name,
            email,
            password,
            defaultBusiness,
            photoFileId,
            status,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }
    }
}