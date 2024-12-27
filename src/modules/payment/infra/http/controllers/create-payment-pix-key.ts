import { BadRequestException, Body, Controller, Post, HttpException, Req, HttpCode } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { CreatePaymentPixKeyUseCase, CreatePixPaymentUseCaseResponse } from '@/domain/payment/use-cases/create-payment-pix-key';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { I18nService, Language } from '@/i18n/i18n.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiHeader } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { AppError } from '@core/error/app-errors';

const createPixPaymentBodySchema = z.object({
    personId: z.string().uuid().optional(),
    keyPix: z.string().min(1, 'PIX key is required'),
    document: z.string().min(11, 'Document must be CPF or CNPJ').max(14),
    paymentDate: z.string().datetime({
        message: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)',
    }),
    amount: z.number().positive('Amount must be greater than 0'),
    messagePix: z.string().optional(),
});

export class PixPaymentRequest extends createZodDto(createPixPaymentBodySchema) { }

const bodyValidationPipe = new ZodValidationPipe(createPixPaymentBodySchema);
type CreatePixPaymentBodySchema = z.infer<typeof createPixPaymentBodySchema>;

@ApiTags('PixPayment')
@Controller('/payments/pix-key')
export class CreatePaymentPixKeyController {
    constructor(
        private createPixPayment: CreatePaymentPixKeyUseCase,
        private i18nService: I18nService
    ) { }

    @Post()
    @HttpCode(201)
    @ApiOperation({
        summary: 'Create a new Pix Payment',
        description: 'Create a new Pix Payment transaction using PIX key. Requires Bearer Token authentication.'
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
    @ApiBody({ type: PixPaymentRequest })
    @ApiResponse({
        status: 201,
        description: 'Pix Payment created successfully'
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - Invalid data provided or insufficient balance'
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized - Invalid or missing authentication token'
    })
    @ApiResponse({
        status: 404,
        description: 'Not Found - Business account not found'
    })
    async handle(
        @Body(bodyValidationPipe) body: CreatePixPaymentBodySchema,
        @CurrentUser() user: UserPayload,
        @Req() req: Request
    ): Promise<CreatePixPaymentUseCaseResponse> {
        const language = ((req.headers['accept-language'] as string) || 'pt-BR') as Language;
        const businessId = user.bus;

        const {
            personId,
            keyPix,
            paymentDate,
            amount,
            document,
            messagePix,
        } = body;

        const result = await this.createPixPayment.execute({
            businessId,
            personId,
            keyValue: keyPix,
            documento: document,
            chavePix: keyPix,
            documentoBeneficiario: document,
            dataPagamento: paymentDate,
            valorPagamento: amount,
            mensagemPix: messagePix,
        }, language);

        if (result.isLeft()) {
            const error = result.value;
            if (error instanceof AppError) {
                throw new HttpException({
                    statusCode: error.httpStatus,
                    errorCode: error.errorCode,
                    message: this.i18nService.translate(error.translationKey, language),
                    details: error.details,
                }, error.httpStatus);
            } else {
                throw new BadRequestException(this.i18nService.translate('errors.unexpected', language));
            }
        }

        return result.value;
    }
}