import {
    BadRequestException,
    Controller,
    HttpCode,
    Param,
    Headers,
    Post,
} from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CancelBoletoUseCase } from '@/domain/transaction/use-cases/cancel-boleto'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiHeader } from '@nestjs/swagger'

@ApiTags('Boleto')
@Controller('/boleto/cancel/:id')
export class CancelBoletoController {
    constructor(private cancelBoleto: CancelBoletoUseCase) { }

    @Post()
    @HttpCode(200)
    @ApiOperation({
        summary: 'Cancel Boleto',
        description: 'Cancel a specific Boleto by its ID'
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
    @ApiParam({ name: 'id', type: 'string', description: 'Boleto ID' })
    @ApiResponse({
        status: 200,
        description: 'Boleto cancelled successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string' }
            }
        }
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Operation not allowed or Boleto already cancelled',
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
        const result = await this.cancelBoleto.execute({
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
            message: result.value.message,
        };
    }
}