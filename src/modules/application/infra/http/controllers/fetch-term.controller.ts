import { BadRequestException, Get, Controller, UseGuards, Query } from '@nestjs/common'
import { JwtAuthGuard } from '@/core/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { TermPresenter } from '@/modules/term-presenter/infra/http/presenters/term-presenter.presenter'
import { FetchTermUseCase } from 'fetch-term.controller'
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiSecurity } from '@nestjs/swagger'

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@ApiTags('Terms')
@Controller('/term')
@UseGuards(JwtAuthGuard)
@ApiSecurity('bearer')
export class FetchTermController {
    constructor(private fetchTerm: FetchTermUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Fetch terms',
        description: 'Retrieves a paginated list of terms and conditions documents'
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
        description: 'Terms retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                term: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                                description: 'Term ID'
                            },
                            title: {
                                type: 'string',
                                description: 'Term title'
                            },
                            content: {
                                type: 'string',
                                description: 'Term content'
                            },
                            language: {
                                type: 'string',
                                description: 'Term language',
                                example: 'en-US'
                            },
                            startAt: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Date when term becomes effective'
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
    async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
        const result = await this.fetchTerm.execute({
            page,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const term = result.value.term

        return { term: term.map(TermPresenter.toHttp) }
    }
}