import { BadRequestException, Body, Controller, Post, HttpException, Req, HttpCode } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { CreatePaymentPixBankDataUseCase, CreatePixPaymentBankDataUseCaseResponse } from '@/domain/payment/use-cases/create-payment-pix-bank-data';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { I18nService, Language } from '@/i18n/i18n.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiHeader } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { AppError } from '@/core/errors/app-errors';

const createPixPaymentBankDataBodySchema = z.object({
    personId: z.string().uuid().optional(),
    documento: z.string(),
    agenciaBeneficiario: z.string(),
    ispbBeneficiario: z.string(),
    contaBeneficiario: z.string(),
    tipoContaBeneficiario: z.enum(['CORRENTE', 'PAGAMENTO', 'SALARIO', 'POUPANCA']),
    nomeBeneficiario: z.string(),
    documentoBeneficiario: z.string(),
    dataPagamento: z.string().datetime(),
    valorPagamento: z.number().positive(),
    mensagemPix: z.string().optional(),
});

class PixPaymentBankDataRequest extends createZodDto(createPixPaymentBankDataBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createPixPaymentBankDataBodySchema);
type CreatePixPaymentBankDataBodySchema = z.infer<typeof createPixPaymentBankDataBodySchema>;

@ApiTags('PixPayment')
@Controller('/payments/pix-bank-data')
export class CreatePaymentPixBankDataController {
    constructor(
        private createPixPaymentBankData: CreatePaymentPixBankDataUseCase,
        private i18nService: I18nService
    ) { }

    @Post()
    @HttpCode(201)
    @ApiOperation({
        summary: 'Create a new Pix Payment with Bank Data',
        description: 'Create a new Pix Payment transaction using bank data. Requires Bearer Token authentication.'
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
    @ApiBody({ type: PixPaymentBankDataRequest })
    @ApiResponse({ status: 201, description: 'Pix Payment created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })

    async handle(
        @Body(bodyValidationPipe) body: CreatePixPaymentBankDataBodySchema,
        @CurrentUser() user: UserPayload,
        @Req() req: Request
    ): Promise<CreatePixPaymentBankDataUseCaseResponse> {

        const language = ((req.headers['accept-language'] as string) || 'en-US') as Language;

        const businessId = user.bus;

        const result = await this.createPixPaymentBankData.execute({
            businessId,
            ...body
        }, language);

        if (result.isLeft()) {
            const error: any = result.value;
            if (error instanceof AppError) {
                throw new HttpException({
                    statusCode: error.httpStatus,
                    errorCode: error.errorCode,
                    message: this.i18nService.translate(error.translationKey, language),
                    details: error.details,
                }, error.httpStatus);
            } else {
                throw new BadRequestException(this.i18nService.translate(error.message, language));
            }
        }

        return result.value;
    }
}