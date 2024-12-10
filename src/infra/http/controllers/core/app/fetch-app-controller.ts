import { BadRequestException, Get, Controller, UseGuards, Query } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AppPresenter } from '@/infra/http/presenters/app-presenter'
import { FetchAppUseCase } from '@/domain/application/use-cases/fetch-app'
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiSecurity } from '@nestjs/swagger'

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Applications')
@Controller('/apps')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class FetchAppController {
    constructor(private fetchApps: FetchAppUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Fetch applications',
        description: 'Retrieves a paginated list of applications'
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
        description: 'Applications retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                app: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                                description: 'Unique identifier of the application'
                            },
                            name: {
                                type: 'string',
                                description: 'Name of the application'
                            },
                            description: {
                                type: 'string',
                                description: 'Detailed description of the application'
                            },
                            price: {
                                type: 'number',
                                description: 'Price of the application',
                                minimum: 0
                            },
                            quantity: {
                                type: 'number',
                                description: 'Available quantity',
                                minimum: 0
                            },
                            type: {
                                type: 'string',
                                description: 'Type of the application'
                            },
                            status: {
                                type: 'string',
                                description: 'Current status of the application'
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
                        },
                        required: ['id', 'name', 'description', 'price', 'quantity', 'type', 'status', 'createdAt', 'updatedAt']
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
        description: 'Unauthorized - Invalid or missing authentication token'
    })
    async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
        const result = await this.fetchApps.execute({
            page,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const app = result.value.app

        return { app: app.map(AppPresenter.toHttp) }
    }
}