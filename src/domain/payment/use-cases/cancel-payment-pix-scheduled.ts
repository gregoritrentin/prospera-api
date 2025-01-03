// import { Injectable, Logger } from '@nestjs/common';
// import { PaymentsProvider } from '@/domain/interfaces/payments-provider';
// import { I18nService, Language } from '@/i18n/i18n.service';
// import { AppError } from '@/core/errors/app-errors';
// import { PaymentRepository } from '@/domain/payment/repositories/payment-repository';
// import { Either, left, right } from '@/core/either';
// import { TransactionManager } from '@/core/transaction/transaction-manager';
// import { CreateAccountMovementUseCase } from '@/domain/account/use-cases/create-account-movement';
// import { RecordTransactionMetricUseCase } from '@/domain/metric/use-case/record-transaction-metrics';
// import { MovementType, PaymentStatus, MetricType } from '@/core/types/enums';

// interface CancelScheduledPixPaymentUseCaseRequest {
//     paymentId: string;
//     businessId: string;
//     accountId: string;
// }

// interface CancelScheduledPixPaymentUseCaseResponse {
//     message: string;
// }

// type CancelScheduledPixPaymentResult = Either<AppError, CancelScheduledPixPaymentUseCaseResponse>;

// @Injectable()
// export class CancelPaymentPixScheduledUseCase {
//     private readonly logger = new Logger(CancelPaymentPixScheduledUseCase.name);

//     constructor(
//         private transactionManager: TransactionManager,
//         private paymentProvider: PaymentsProvider,
//         private paymentRepository: PaymentRepository,
//         private createAccountMovement: CreateAccountMovementUseCase,
//         private recordTransactionMetric: RecordTransactionMetricUseCase,
//         private i18nService: I18nService,
//     ) { }

//     async execute(
//         input: CancelScheduledPixPaymentUseCaseRequest,
//         language: Language = 'pt-BR'
//     ): Promise<CancelScheduledPixPaymentResult> {
//         this.logger.debug('=== Starting CancelPaymentPixScheduledUseCase ===');
//         this.logger.debug('Input:', {
//             paymentId: input.paymentId,
//             businessId: input.businessId,
//             accountId: input.accountId
//         });

//         return await this.transactionManager.start(async () => {
//             try {
//                 // Buscar o pagamento
//                 const existingPayment = await this.paymentRepository.findById(input.paymentId, input.businessId);

//                 if (!existingPayment) {
//                     this.logger.debug('Payment not found');
//                     return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'));
//                 }

//                 if (!existingPayment.paymentId) {
//                     this.logger.debug('Payment ID not found');
//                     return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'));
//                 }

//                 // Verificar se o pagamento está agendado
//                 if (existingPayment.status !== PaymentStatus.SCHEDULED) {
//                     this.logger.debug('Invalid payment status for cancellation:', existingPayment.status);
//                     return left(AppError.invalidOperation('errors.INVALID_OPERATION'));
//                 }

//                 try {
//                     // Cancelar no provedor
//                     this.logger.debug('Cancelling scheduled payment in provider');
//                     await this.paymentProvider.cancelarPixAgendado({
//                         idTransacao: existingPayment.paymentId
//                     });
//                 } catch (providerError) {
//                     this.logger.error('Provider error:', providerError);
//                     return left(AppError.paymentPixCancelationFailed());
//                 }

//                 // Atualizar status do pagamento
//                 existingPayment.status = PaymentStatus.CANCELLED;
//                 //existingPayment.updatedAt = new Date();

//                 try {
//                     await this.paymentRepository.save(existingPayment);
//                     this.logger.debug('Payment status updated to CANCELLED');
//                 } catch (saveError) {
//                     this.logger.error('Failed to save payment:', saveError);
//                     return left(AppError.internalServerError('errors.INTERNAL_SERVER_ERROR'));
//                 }

//                 // Se houve débito prévio, fazer estorno
//                 if (existingPayment.amount > 0) {
//                     this.logger.debug('Creating refund movement');
//                     const refundResult = await this.createAccountMovement.execute({
//                         accountId: input.accountId,
//                         businessId: input.businessId,
//                         type: MovementType.CREDIT,
//                         amount: existingPayment.amount,
//                         description: `Estorno PIX Agendado - ${existingPayment.paymentId}`
//                     });

//                     if (refundResult.isLeft()) {
//                         this.logger.error('Failed to create refund movement:', refundResult.value);
//                         return left(refundResult.value);
//                     }
//                 }

//                 // Registrar métrica
//                 this.logger.debug('Recording metric');
//                 const metricResult = await this.recordTransactionMetric.execute({
//                     businessId: input.businessId,
//                     type: MetricType.PIX_PAYMENT,
//                     amount: existingPayment.amount,
//                     status: PaymentStatus.CANCELLED
//                 });

//                 if (metricResult.isLeft()) {
//                     this.logger.warn('Failed to record transaction metric:', metricResult.value);
//                 }

//                 const successMessage = this.i18nService.translate('messages.PIX_PAYMENT_CANCELLED', language);
//                 this.logger.debug('=== CancelPaymentPixScheduledUseCase completed successfully ===');

//                 return right({ message: successMessage });

//             } catch (error) {
//                 this.logger.error('=== Error in CancelPaymentPixScheduledUseCase ===');
//                 this.logger.error('Error details:', error instanceof Error ? {
//                     message: error.message,
//                     stack: error.stack
//                 } : String(error));

//                 return left(AppError.paymentPixCancelationFailed());
//             }
//         });
//     }
// }