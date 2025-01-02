import { BadRequestException, Get, Controller, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/core/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiSecurity } from '@nestjs/swagger'
import { createZodDto } from 'nestjs-zod'
import { InvoicePresenter } from '@/modules/invoice-presenter/infra/http/presenters/invoice-presenter.presenter'
import { FetchInvoicesUseCase } from '@/modules/invoice/domain/use-cases/fetch-invoices'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

// Create DTO for Swagger documentation
class PageQueryDto extends createZodDto(z.object({ page: pageQueryParamSchema })) { }

@ApiTags('Invoices')
@Controller('/person')
@ApiSecurity('bearer')
export class FetchInvoicesController {
    constructor(private fetchInvoice: FetchInvoicesUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Fetch invoices',
        description: 'Retrieves a paginated list of invoices for the current business'
    })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination (default: 1)',
        schema: {
            minimum: 1
        }
    })
    @ApiResponse({
        status: 200,
        description: 'Invoices retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                persons: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                                format: 'uuid',
                                description: 'Invoice ID'
                            },
                            amount: {
                                type: 'number',
                                description: 'Invoice amount'
                            },
                            status: {
                                type: 'string',
                                description: 'Invoice status'
                            },
                            createdAt: {
                                type: 'string',
                                format: 'date-time',
                                description: 'Invoice creation date'
                            }
                            // Adicione outros campos conforme retornados pelo InvoicePresenter.toHttp
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid page parameter',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid page parameter'
                },
                statusCode: {
                    type: 'number',
                    example: 400
                }
            }
        }
    })
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @CurrentUser() user: UserPayload,
    ) {
        const business = user.bus
        const result = await this.fetchInvoice.execute({
            page,
            businessId: business,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const persons = result.value.invoices

        return { persons: persons.map(InvoicePresenter.toHttp) }
    }
}