import {
    BadRequestException,
    Controller,
    Get,
    HttpCode,
    Param,
    Headers,
    InternalServerErrorException,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { PrintBoletoUseCase } from '@/domain/transaction/use-cases/print-boleto'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { AppError } from '@/core/errors/app-errors'
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiHeader } from '@nestjs/swagger'

@ApiTags('Boleto')
@Controller('/boleto/print/:id')
export class PrintBoletoController {
    constructor(private printBoleto: PrintBoletoUseCase) { }

    @Get()
    @HttpCode(200)
    @ApiOperation({
        summary: 'Print Boleto',
        description: 'Generate a PDF for a specific Boleto by its ID. The response language is determined by the Accept-Language header.'
    })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
        required: true,
    })
    @ApiHeader({
        name: 'Accept-Language',
        description: 'Preferred language for the response. If not provided, defaults to pt-BR.',
        required: false,
        schema: { type: 'string', default: 'pt-BR', enum: ['en-US', 'pt-BR'] },
    })
    @ApiParam({ name: 'id', type: 'string', description: 'Boleto ID' })
    @ApiResponse({
        status: 200,
        description: 'Boleto PDF generated successfully',
        schema: {
            type: 'object',
            properties: {
                pdfUrl: { type: 'string' }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Operation not allowed or Boleto not found',
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
        @Param('id') boletoId: string,
        @Headers('Accept-Language') language: string = 'en-US',
    ) {
        const result = await this.printBoleto.execute({
            businessId: user.bus,
            boletoId: boletoId,
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
            pdfUrl: result.value,
        };
    }
}