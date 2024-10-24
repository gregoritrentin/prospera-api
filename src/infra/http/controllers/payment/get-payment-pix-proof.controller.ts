import { Controller, Get, HttpException, Req, HttpCode, Param, Res } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { GetPaymentPixProofUseCase } from '@/domain/payment/use-cases/get-payment-pix-proof';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { I18nService, Language } from '@/i18n/i18n.service';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiParam } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { AppError } from '@/core/errors/app-errors';
import { Response } from 'express';

const proofPixPaymentParamsSchema = z.object({
    paymentId: z.string().uuid(),
});

class ProofPixPaymentParams extends createZodDto(proofPixPaymentParamsSchema) { }

const paramsValidationPipe = new ZodValidationPipe(proofPixPaymentParamsSchema);
type ProofPixPaymentParamsSchema = z.infer<typeof proofPixPaymentParamsSchema>;

@ApiTags('PixPayment')
@Controller('/payments/pix/proof')
export class GetPaymentPixProofController {
    constructor(
        private proofPixPayment: GetPaymentPixProofUseCase,
        private i18nService: I18nService
    ) { }

    @Get(':paymentId')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Get Pix Payment Proof',
        description: 'Get the proof of a Pix Payment transaction in PDF format. Requires Bearer Token authentication.'
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
    @ApiParam({ name: 'paymentId', type: 'string', description: 'The ID of the payment to get the proof for' })
    @ApiResponse({ status: 200, description: 'Pix Payment proof retrieved successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Payment not found' })

    async handle(
        @Param(paramsValidationPipe) params: ProofPixPaymentParamsSchema,
        @CurrentUser() user: UserPayload,
        @Req() req: Request,
        @Res() res: Response
    ): Promise<void> {
        const language = ((req.headers['accept-language'] as string) || 'en-US') as Language;

        const businessId = user.bus;
        const { paymentId } = params;

        const result = await this.proofPixPayment.execute({
            businessId,
            paymentId,
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
                // Tratamento genérico para outros tipos de erro
                const errorMessage = (error as any).message ? (error as any).message : 'An unknown error occurred';
                throw new HttpException(this.i18nService.translate('errors.UNKNOWN_ERROR', language, { error: errorMessage }), 500);
            }
        }

        const { proofPdf } = result.value;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=pix_proof_${paymentId}.pdf`);
        res.send(proofPdf);
    }
}