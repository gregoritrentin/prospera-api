import {
    BadRequestException,
    Controller,
    HttpCode,
    Param,
    Headers,
    Post,
} from '@nestjs/common'
import { UserPayload } from '@/core/infra/auth/jwt.strategy'
import { CancelInvoiceUseCase } from 'cancel-invoice.controller'
import { CurrentUser } from '@/core/infra/auth/current-user-decorator'
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiHeader } from '@nestjs/swagger'

@ApiTags('Invoice')
@Controller('/invoice/cancel/:id')
export class CancelInvoiceController {
    constructor(private cancelInvoice: CancelInvoiceUseCase) { }

    @Post()
    @HttpCode(200)
    @ApiOperation({
        summary: 'Cancel Invoice',
        description: 'Cancel a specific Invoice by its ID'
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
        required: true,
    })
    @ApiHeader({
        name: 'Accept-Language',
        description: 'Preferred language for the response. If not provided, defaults to en-US.',
        required: false,
        schema: { type: 'string', default: 'en-US', enum: ['en-US', 'pt-BR'] },
    })
    @ApiParam({ name: 'id', type: 'string', description: 'Invoice ID' })
    @ApiResponse({
        status: 200,
        description: 'Invoice cancelled successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Operation not allowed or Invoice already cancelled',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                code: { type: 'string' },
                details: { type: 'object' }
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 500, description: 'Internal server error' })
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') invoiceId: string,
        @Headers('Accept-Language') language: string = 'en-US',
    ) {
        const result = await this.cancelInvoice.execute({
            businessId: user.bus,
            invoiceId: invoiceId,
            language: language as 'en-US' | 'pt-BR',
        })

        if (result.isLeft()) {
            const error = result.value;
            throw new BadRequestException({
                message: error.message,
                code: error.errorCode,
                details: error.details,
            });
        }

        return {
            message: result.value.message,
        };
    }
}