// import { right, left, Either } from '@/core/either';
// import { Injectable, Logger } from '@nestjs/common';
// import { UniqueEntityID } from '@/core/entities/unique-entity-id';
// import { PaymentsProvider } from '../../interfaces/payments-provider';
// import { I18nService, Language } from '@/i18n/i18n.service';
// import { AppError } from '@/core/errors/app-errors';
// import { Payment } from '@/domain/payment/entities/payment';
// import { PaymentRepository } from '@/domain/payment/repositories/payment-repository';
// import { TransactionManager } from '@/core/transaction/transaction-manager';
// import { CreateAccountMovementUseCase } from '@/domain/account/use-cases/create-account-movement';
// import { RecordTransactionMetricUseCase } from '@/domain/metric/use-case/record-transaction-metrics';
// import { MovementType, PaymentStatus, MetricType } from '@/core/types/enums';

// interface UpdatePixPaymentUseCaseRequest {
//     paymentId: string;
//     businessId: string;
//     accountId: string;
// }

// interface UpdatePixPaymentUseCaseResponse {
//     payment: Payment;
//     message: string;
// }

// type UpdatePixPaymentResult = Either<AppError, UpdatePixPaymentUseCaseResponse>;

// @Injectable()
// export class UpdatePaymentPixUseCase {
//     private readonly logger = new Logger(UpdatePaymentPixUseCase.name);

//     constructor(
//         private transactionManager: TransactionManager,
//         private paymentProvider: PaymentsProvider,
//         private paymentRepository: PaymentRepository,
//         private createAccountMovement: CreateAccountMovementUseCase,
//         private recordTransactionMetric: RecordTransactionMetricUseCase,
//         private i18nService: I18nService,
//     ) { }

//     async execute(
//         input: UpdatePixPaymentUseCaseRequest,
//         language: Language = 'pt-BR'
//     ): Promise<UpdatePixPaymentResult> {
//         this.logger.debug('=== Starting UpdatePaymentPixUseCase ===');
//         this.logger.debug('Input:', {
//             paymentId: input.paymentId,
//             businessId: input.businessId,
//             accountId: input.accountId
//         });

//         return await this.transactionManager.start(async () => {
//             try {
//                 const existingPayment = await this.paymentRepository.findById(input.paymentId, input.businessId);

//                 if (!existingPayment) {
//                     this.logger.debug('Payment not found');
//                     return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'));
//                 }

//                 if (!existingPayment.paymentId) {
//                     this.logger.debug('Payment ID not found');
//                     return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'));
//                 }

//                 // Buscar status atualizado no provedor
//                 const updatedPaymentData = await this.paymentProvider.buscarPixPorIdTransacao({
//                     idTransacao: existingPayment.paymentId
//                 });

//                 if (!updatedPaymentData) {
//                     this.logger.debug('Updated payment data not found');
//                     return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'));
//                 }

//                 // Mapear novo status
//                 const newStatus = this.mapStatus(updatedPaymentData.status);
//                 const previousStatus = existingPayment.status as PaymentStatus;

//                 // Se o status mudou, atualizar pagamento e registrar métrica
//                 if (newStatus !== previousStatus) {
//                     this.logger.debug(`Status changed from ${previousStatus} to ${newStatus}`);

//                     const updatedPayment = this.updatePaymentFromResponse(existingPayment, updatedPaymentData);
//                     await this.paymentRepository.save(updatedPayment);

//                     // Se o pagamento foi confirmado, criar movimento de débito
//                     if (newStatus === PaymentStatus.PAID && previousStatus !== PaymentStatus.PAID) {
//                         this.logger.debug('Creating debit movement for confirmed payment');

//                         const movementResult = await this.createAccountMovement.execute({
//                             accountId: input.accountId,
//                             businessId: input.businessId,
//                             type: MovementType.DEBIT,
//                             amount: updatedPayment.amount,
//                             description: `Pagamento PIX - ${updatedPayment.paymentId}`
//                         });

//                         if (movementResult.isLeft()) {
//                             this.logger.error('Failed to create account movement:', movementResult.value);
//                             return left(movementResult.value);
//                         }
//                     }

//                     // Se o pagamento foi cancelado ou falhou e estava PAID, fazer estorno
//                     if ([PaymentStatus.CANCELLED, PaymentStatus.FAILURE].includes(newStatus) &&
//                         previousStatus === PaymentStatus.PAID) {
//                         this.logger.debug('Creating refund movement for cancelled/failed payment');

//                         const refundResult = await this.createAccountMovement.execute({
//                             accountId: input.accountId,
//                             businessId: input.businessId,
//                             type: MovementType.CREDIT,
//                             amount: updatedPayment.amount,
//                             description: `Estorno PIX - ${updatedPayment.paymentId}`
//                         });

//                         if (refundResult.isLeft()) {
//                             this.logger.error('Failed to create refund movement:', refundResult.value);
//                             return left(refundResult.value);
//                         }
//                     }

//                     // Registrar métrica
//                     const metricResult = await this.recordTransactionMetric.execute({
//                         businessId: input.businessId,
//                         type: MetricType.PIX_PAYMENT,
//                         amount: updatedPayment.amount,
//                         status: newStatus
//                     });

//                     if (metricResult.isLeft()) {
//                         this.logger.warn('Failed to record transaction metric:', metricResult.value);
//                     }

//                     const successMessage = this.i18nService.translate('messages.PIX_PAYMENT_UPDATED', language);
//                     this.logger.debug('=== UpdatePaymentPixUseCase completed successfully ===');

//                     return right({
//                         payment: updatedPayment,
//                         message: successMessage
//                     });
//                 }

//                 // Se o status não mudou, retornar o pagamento existente
//                 this.logger.debug('No status change detected');
//                 return right({
//                     payment: existingPayment,
//                     message: this.i18nService.translate('messages.NO_UPDATES', language)
//                 });

//             } catch (error) {
//                 this.logger.error('=== Error in UpdatePaymentPixUseCase ===');
//                 this.logger.error('Error details:', error instanceof Error ? {
//                     message: error.message,
//                     stack: error.stack
//                 } : String(error));

//                 return left(AppError.paymentPixUpdateFailed());
//             }
//         });
//     }

//     private updatePaymentFromResponse(existingPayment: Payment, updatedData: any): Payment {
//         if (!updatedData) {
//             throw new Error(this.i18nService.translate('errors.PIX_PAYMENT_UPDATE_FAILED'));
//         }

//         const updatedProps = {
//             businessId: existingPayment.businessId,
//             personId: existingPayment.personId,
//             paymentType: existingPayment.paymentType,
//             status: this.mapStatus(updatedData.status),
//             paymentId: updatedData.idPagamentoPix || existingPayment.paymentId,
//             amount: updatedData.valorPagamento || existingPayment.amount,
//             feeAmount: existingPayment.feeAmount,
//             paymentDate: new Date(updatedData.dataPagamento) || existingPayment.paymentDate,
//             createdAt: existingPayment.createdAt,
//             updatedAt: new Date(),
//             // Manter outros campos do pagamento existente
//             pixKey: existingPayment.pixKey,
//             pixMessage: existingPayment.pixMessage,
//             beneficiaryBranch: existingPayment.beneficiaryBranch,
//             beneficiaryIspb: existingPayment.beneficiaryIspb,
//             beneficiaryAccount: existingPayment.beneficiaryAccount,
//             beneficiaryAccountType: existingPayment.beneficiaryAccountType,
//             beneficiaryName: existingPayment.beneficiaryName,
//             beneficiaryDocument: existingPayment.beneficiaryDocument,
//         };

//         return Payment.create(updatedProps, new UniqueEntityID(existingPayment.id.toString()));
//     }

//     private mapStatus(sicrediStatus: string): PaymentStatus {
//         switch (sicrediStatus) {
//             case 'SUCESSO':
//                 return PaymentStatus.PAID;
//             case 'AGENDADO':
//                 return PaymentStatus.SCHEDULED;
//             case 'CANCELADO':
//                 return PaymentStatus.CANCELLED;
//             case 'ERRO':
//                 return PaymentStatus.FAILURE;
//             default:
//                 return PaymentStatus.PENDING;
//         }
//     }
// }