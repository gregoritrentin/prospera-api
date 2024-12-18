import {
    BadRequestException,
    Controller,
    Param,
    Get,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { GetBoletoUseCase } from '@/domain/transaction/use-cases/get-boleto';
import { BoletoDetailsPresenter } from '@/infra/http/presenters/transaction-boleto-details-presenter';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

const getBoletoParamSchema = z.object({
    id: z.string().uuid(),
});

class GetBoletoParam extends createZodDto(getBoletoParamSchema) { }

@ApiTags('Boleto')
@Controller('/boleto/:id')
export class GetBoletoController {
    constructor(private getBoleto: GetBoletoUseCase) { }

    @Get()
    @ApiOperation({ summary: 'Get Boleto', description: 'Retrieve a specific Boleto by its ID' })
    @ApiHeader({
        name: 'Authorization',
        description: 'Bearer Token',
        required: true,
    })
    @ApiHeader({
        name: 'Accept-Language',
        description: 'Preferred language for the response. If not provided, defaults to en-US.',
        required: false,
        schema: { type: 'string', default: 'en-US', enum: ['en-US', 'pt-BR'] }, // Ajuste os idiomas conforme necessário
    })
    @ApiParam({ name: 'id', type: 'string', description: 'Boleto ID' })
    @ApiResponse({ status: 200, description: 'Boleto retrieved successfully', })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })

    async handle(
        @CurrentUser() user: UserPayload,
        @Param(new ZodValidationPipe(getBoletoParamSchema)) params: GetBoletoParam,
    ) {
        const businessId = user.bus;

        const result = await this.getBoleto.execute({
            businessId: businessId,
            boletoId: params.id,
        });

        if (result.isLeft()) {
            const error = result.value;
            throw new BadRequestException(error.message);
        }

        const boleto = result.value.boleto;

        return BoletoDetailsPresenter.toHttp(boleto);
    }
}