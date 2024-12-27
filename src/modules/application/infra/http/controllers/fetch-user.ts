import { BadRequestException, Get, Controller, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { UserPresenter } from '@/infra/http/presenters/user-presenter'
import { FetchUserUseCase } from '@/domain/application/use-cases/fetch-user'
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiSecurity } from '@nestjs/swagger'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Users')
@Controller('/users')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class FetchUserController {
    constructor(private fetchUser: FetchUserUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Fetch users',
        description: 'Retrieves a paginated list of users'
    })
    @ApiQuery({
        name: 'page',
        description: 'Page number for pagination (minimum: 1)',
        required: false,
        type: Number,
        example: 1
    })
    @ApiResponse({
        status: 200,
        description: 'Users retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                user: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                                description: 'User ID'
                            },
                            name: {
                                type: 'string',
                                description: 'User full name'
                            },
                            email: {
                                type: 'string',
                                format: 'email',
                                description: 'User email address'
                            },
                            defaultBusiness: {
                                type: 'string',
                                format: 'uuid',
                                description: 'Default business ID',
                                nullable: true
                            },
                            photoFileId: {
                                type: 'string',
                                format: 'uuid',
                                description: 'Profile photo file ID',
                                nullable: true
                            },
                            status: {
                                type: 'string',
                                description: 'User status',
                                enum: ['ACTIVE', 'INACTIVE', 'PENDING']
                            },
                            createdAt: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Creation timestamp'
                            },
                            updatedAt: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Last update timestamp'
                            }
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid page number'
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid or missing JWT token'
    })
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    ) {
        const result = await this.fetchUser.execute({
            page,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const user = result.value.user

        return { user: user.map(UserPresenter.toHttp) }
    }
}