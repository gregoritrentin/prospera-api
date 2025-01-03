import { BadRequestException, Get, Controller, Query } from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { BoletoDetailsPresenter } from '@/infra/http/presenters/transaction-boleto-details-presenter';
import { FetchBoletoUseCase } from '@/domain/transaction/use-cases/fetch-boletos';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { createZodDto } from 'nestjs-zod';

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

class PageQueryDto extends createZodDto(z.object({ page: pageQueryParamSchema })) { }

@ApiTags('Boleto')
@Controller('/boleto')
export class FetchBoletoController {
    constructor(private fetchBoleto: FetchBoletoUseCase) { }

    @Get()
    @ApiOperation({ summary: 'Fetch Boletos', description: 'Retrieve a list of Boletos for the authenticated user' })
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
    @ApiResponse({ status: 200, description: 'Boleto retrieved successfully', })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })

    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination (default: 1)',
    })
    @ApiResponse({
        status: 200,
        description: 'List of Boletos retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                boletos: {
                    type: 'array',
                    items: {
                        type: 'object',
                        // Define the properties of a Boleto here
                        // This should match the structure returned by BoletoDetailsPresenter.toHttp
                    },
                },
            },
        },
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @CurrentUser() user: UserPayload,
    ) {
        const business = user.bus;
        const result = await this.fetchBoleto.execute({
            page,
            businessId: business,
        });

        if (result.isLeft()) {
            throw new BadRequestException();
        }

        const boletos = result.value.boletos;

        return { boletos: boletos.map(BoletoDetailsPresenter.toHttp) };
    }
}