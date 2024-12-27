// import { BadRequestException, Body, Controller, Put, HttpException, Req, HttpCode, Param } from '@nestjs/common';
// import { z } from 'zod';
// import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
// import { CurrentUser } from '@/infra/auth/current-user-decorator';
// import { UpdatePaymentPixUseCase } from '@/domain/payment/use-cases/update-payment-pix';
// import { UserPayload } from '@/infra/auth/jwt.strategy';
// import { I18nService, Language } from '@/i18n/i18n.service';
// import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiHeader, ApiParam } from '@nestjs/swagger';
// import { createZodDto } from 'nestjs-zod';
// import { AppError } from '@core/error/app-errors';

// const updatePixPaymentParamsSchema = z.object({
//     paymentId: z.string().uuid(),
// });

// class UpdatePixPaymentParams extends createZodDto(updatePixPaymentParamsSchema) { }

// const paramsValidationPipe = new ZodValidationPipe(updatePixPaymentParamsSchema);
// type UpdatePixPaymentParamsSchema = z.infer<typeof updatePixPaymentParamsSchema>;

// @ApiTags('PixPayment')
// @Controller('/payments/pix')
// export class UpdatePaymentPixController {
//     constructor(
//         private updatePixPayment: UpdatePaymentPixUseCase,
//         private i18nService: I18nService
//     ) { }

//     @Put(':paymentId')
//     @HttpCode(200)
//     @ApiOperation({
//         summary: 'Update a Pix Payment',
//         description: 'Update an existing Pix Payment transaction. Requires Bearer Token authentication.'
//     })
//     @ApiHeader({
//         name: 'Authorization',
//         description: 'Bearer Token',
//         required: true,
//     })
//     @ApiHeader({
//         name: 'Accept-Language',
//         description: 'Preferred language for the response. If not provided, defaults to pt-BR.',
//         required: false,
//         schema: { type: 'string', default: 'pt-BR', enum: ['en-US', 'pt-BR'] },
//     })
//     @ApiParam({ name: 'paymentId', type: 'string', description: 'The ID of the payment to update' })
//     @ApiResponse({ status: 200, description: 'Pix Payment updated successfully' })
//     @ApiResponse({ status: 400, description: 'Bad request' })
//     @ApiResponse({ status: 401, description: 'Unauthorized' })
//     @ApiResponse({ status: 404, description: 'Payment not found' })

//     async handle(
//         @Param(paramsValidationPipe) params: UpdatePixPaymentParamsSchema,
//         @CurrentUser() user: UserPayload,
//         @Req() req: Request
//     ): Promise<UpdatePixPaymentUseCaseResponse> {

//         const language = ((req.headers['accept-language'] as string) || 'en-US') as Language;

//         const businessId = user.bus;
//         const { paymentId } = params;

//         const result = await this.updatePixPayment.execute({
//             businessId,
//             paymentId,
//         }, language);

//         if (result.isLeft()) {
//             const error: AppError | Error = result.value;
//             if (error instanceof AppError) {
//                 throw new HttpException({
//                     statusCode: error.httpStatus,
//                     errorCode: error.errorCode,
//                     message: this.i18nService.translate(error.translationKey, language),
//                     details: error.details,
//                 }, error.httpStatus);
//             } else {
//                 throw new BadRequestException(this.i18nService.translate(error.message, language));
//             }
//         }

//         return result.value;
//     }
// }