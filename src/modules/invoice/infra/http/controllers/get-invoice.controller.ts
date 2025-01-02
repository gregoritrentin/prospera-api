import {
    BadRequestException,
    Controller,
    Param,
    Get,
} from '@nestjs/common'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
import { GetInvoiceUseCase } from 'get-invoice.controller'
import { InvoicePresenter } from '@/modules/invoice-presenter/infra/http/presenters/invoice-presenter.presenter'
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiSecurity } from '@nestjs/swagger'

@ApiTags('Invoices')
@Controller('/invoice/:id')
@ApiSecurity('bearer')
export class GetInvoiceController {
    constructor(private getInvoice: GetInvoiceUseCase) { }

    @Get()
    @ApiOperation({
        summary: 'Get invoice details',
        description: 'Retrieves detailed information of a specific invoice by ID'
    })
    @ApiParam({
        name: 'id',
        type: 'string',
        description: 'Invoice ID',
        format: 'uuid',
        required: true
    })
    @ApiResponse({
        status: 200,
        description: 'Invoice retrieved successfully',
        schema: {
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
                },
                // Adicione outros campos conforme retornados pelo InvoicePresenter.toHttp
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid invoice ID or business access',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invalid invoice ID or business access'
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
        description: 'Invoice not found',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    description: 'Error message',
                    example: 'Invoice not found'
                },
                statusCode: {
                    type: 'number',
                    example: 404
                }
            }
        }
    })
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') invoiceId: string,
    ) {
        const businessId = user.bus

        const result = await this.getInvoice.execute({
            businessId: businessId,
            invoiceId: invoiceId,
        })

        if (result.isLeft()) {
            throw new BadRequestException()
        }

        const invoice = result.value.invoice

        return InvoicePresenter.toHttp(invoice)
    }
}