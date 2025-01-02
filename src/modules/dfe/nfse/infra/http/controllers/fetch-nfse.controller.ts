import { BadRequestException, Get, Controller, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiHeader } from '@nestjs/swagger'
import { FetchNfsesUseCase } from '@/modules/dfe/domain/nfse/use-cases/fetch-nfses'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
import { createZodDto } from 'nestjs-zod'

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const dateQueryParamSchema = z
    .string()
    .optional()
    .transform((date) => date ? new Date(date) : undefined)

const querySchema = z.object({
    page: pageQueryParamSchema,
    startDate: dateQueryParamSchema,
    endDate: dateQueryParamSchema
})

const queryValidationPipe = new ZodValidationPipe(querySchema)
type QueryParamSchema = z.infer<typeof querySchema>

class QueryParamsDto extends createZodDto(querySchema) { }

@ApiTags('NFSe')
@Controller('/nfses')
export class FetchNfsesController {
    constructor(private fetchNfses: FetchNfsesUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Fetch NFSEs',
        description: 'List all NFSEs (Notas Fiscais de Serviço Eletrônicas) for the business with optional date filtering'
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
        required: true,
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination (default: 1)',
    })
    @ApiQuery({
        name: 'startDate',
        required: false,
        type: String,
        description: 'Start date for filtering NFSEs (format: YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        type: String,
        description: 'End date for filtering NFSEs (format: YYYY-MM-DD)',
    })
    @ApiResponse({
        status: 200,
        description: 'NFSEs retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                nfses: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                description: 'NFSe ID'
                            },
                            // Adicione outros campos do NFSe conforme necessário
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid parameters',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid query parameters'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    async handle(
        @Query(queryValidationPipe) query: QueryParamSchema,
        @CurrentUser() user: UserPayload,
    ) {
        const result = await this.fetchNfses.execute({
            page: query.page,
            businessId: user.bus,
            startDate: query.startDate,
            endDate: query.endDate
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        return {
            nfses: result.value.nfses
        }
    }
}