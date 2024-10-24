import { Controller, Post, HttpException, Req, HttpCode, Param } from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { CancelPaymentPixScheduledUseCase } from '@/domain/payment/use-cases/cancel-payment-pix-scheduled';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { I18nService, Language } from '@/i18n/i18n.service';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiParam } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { AppError } from '@/core/errors/app-errors';

const cancelScheduledPixPaymentParamsSchema = z.object({
    paymentId: z.string().uuid(),
});

class CancelScheduledPixPaymentParams extends createZodDto(cancelScheduledPixPaymentParamsSchema) { }

const paramsValidationPipe = new ZodValidationPipe(cancelScheduledPixPaymentParamsSchema);
type CancelScheduledPixPaymentParamsSchema = z.infer<typeof cancelScheduledPixPaymentParamsSchema>;

@ApiTags('PixPayment')
@Controller('/payments/pix')
export class CancelScheduledPixPaymentController {
    constructor(
        private cancelScheduledPixPayment: CancelPaymentPixScheduledUseCase,
        private i18nService: I18nService
    ) { }

    @Post(':paymentId/cancel')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Cancel a scheduled Pix Payment',
        description: 'Cancel a scheduled Pix Payment transaction. Requires Bearer Token authentication.'
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
    @ApiParam({ name: 'paymentId', type: 'string', description: 'The ID of the payment to cancel' })
    @ApiResponse({ status: 200, description: 'Pix Payment cancelled successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Payment not found' })

    async handle(
        @Param(paramsValidationPipe) params: CancelScheduledPixPaymentParamsSchema,
        @CurrentUser() user: UserPayload,
        @Req() req: Request
    ): Promise<{ message: string }> {
        const language = ((req.headers['accept-language'] as string) || 'en-US') as Language;

        const businessId = user.bus;
        const { paymentId } = params;

        const result = await this.cancelScheduledPixPayment.execute({
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

        return result.value;
    }
}