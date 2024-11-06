// import { Injectable } from '@nestjs/common';
// import { Either, left, right } from '@/core/either';
// import { AppError } from '@/core/errors/app-errors';
// import { Sale, SaleStatus } from '../entities/sale';
// import { SalesRepository } from '../repositories/sales-repository';
// import { I18nService, Language } from '@/i18n/i18n.service';

// interface PaymentMethod {
//     id: string;
//     name: string;
//     type: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
//     expirationHours: number;
// }

// interface RequestSalePrePaymentUseCaseRequest {
//     saleId: string;
//     paymentMethod: string; // ID do método de pagamento
//     requestedBy: string; // ID do usuário que está solicitando
//     notes?: string;
// }

// interface PrePaymentInfo {
//     expirationDate: Date;
//     paymentUrl?: string;
//     paymentCode?: string;
//     qrCode?: string;
//     amount: number;
// }

// type RequestSalePrePaymentUseCaseResponse = Either<
//     AppError,
//     {
//         sale: Sale;
//         paymentInfo: PrePaymentInfo;
//         message: string;
//     }
// >;

// @Injectable()
// export class RequestSalePrePaymentUseCase {
//     constructor(
//         private salesRepository: SalesRepository,
//         private paymentService: PaymentService,
//         private i18nService: I18nService
//     ) { }

//     async execute(
//         request: RequestSalePrePaymentUseCaseRequest,
//         language: Language = 'en-US'
//     ): Promise<RequestSalePrePaymentUseCaseResponse> {
//         // 1. Buscar a venda
//         const sale = await this.salesRepository.findById(request.saleId);

//         if (!sale) {
//             return left(
//                 new AppError(
//                     'errors.SALE_NOT_FOUND',
//                     this.i18nService.translate('errors.SALE_NOT_FOUND', language)
//                 )
//             );
//         }

//         // 2. Validar status atual
//         if (sale.status !== SaleStatus.CREDIT_DENIED) {
//             return left(
//                 new AppError(
//                     'errors.INVALID_STATUS_FOR_PREPAYMENT',
//                     this.i18nService.translate('errors.INVALID_STATUS_FOR_PREPAYMENT', language, {
//                         status: sale.status
//                     })
//                 )
//             );
//         }

//         try {
//             // 3. Validar requisição de pagamento
//             const validationResult = await this.validatePrePaymentRequest(sale, request);
//             if (validationResult.isLeft()) {
//                 return left(validationResult.value);
//             }

//             // 4. Gerar informações de pagamento
//             const paymentInfo = await this.generatePaymentInfo(sale, request);

//             // 5. Registrar a solicitação de pagamento
//             await this.registerPaymentRequest(sale, request, paymentInfo);

//             // 6. Atualizar status da venda
//             const previousStatus = sale.status;
//             sale.status = SaleStatus.WAITING_PREPAYMENT;

//             // 7. Registrar histórico
//             await this.salesRepository.createHistory({
//                 saleId: sale.id,
//                 oldStatus: previousStatus,
//                 newStatus: SaleStatus.WAITING_PREPAYMENT,
//                 userId: request.requestedBy,
//                 date: new Date(),
//                 notes: `Pré-pagamento solicitado: ${request.paymentMethod}`
//             });

//             // 8. Salvar a venda
//             await this.salesRepository.save(sale);

//             return right({
//                 sale,
//                 paymentInfo,
//                 message: this.i18nService.translate('messages.PREPAYMENT_REQUESTED_SUCCESSFULLY', language)
//             });

//         } catch (error) {
//             if (error instanceof AppError) {
//                 return left(error);
//             }

//             return left(
//                 new AppError(
//                     'errors.UNEXPECTED_ERROR',
//                     this.i18nService.translate('errors.UNEXPECTED_ERROR', language)
//                 )
//             );
//         }
//     }

//     private async validatePrePaymentRequest(
//         sale: Sale,
//         request: RequestSalePrePaymentUseCaseRequest
//     ): Promise<Either<AppError, true>> {
//         // 1. Validar se existe pagamento pendente
//         const pendingPayment = await this.salesRepository.findPendingPayment(sale.id);
//         if (pendingPayment) {
//             return left(
//                 new AppError(
//                     'errors.PENDING_PAYMENT_EXISTS',
//                     'There is already a pending payment for this sale'
//                 )
//             );
//         }

//         // 2. Validar método de pagamento
//         const paymentMethod = await this.paymentService.getPaymentMethod(request.paymentMethod);
//         if (!paymentMethod) {
//             return left(
//                 new AppError(
//                     'errors.INVALID_PAYMENT_METHOD',
//                     'Payment method not found or inactive'
//                 )
//             );
//         }

//         // 3. Validar valor mínimo/máximo para o método de pagamento
//         const isValidAmount = await this.paymentService.validateAmount(
//             sale.amount,
//             paymentMethod.id
//         );
//         if (!isValidAmount) {
//             return left(
//                 new AppError(
//                     'errors.INVALID_AMOUNT_FOR_PAYMENT_METHOD',
//                     'Amount not supported for selected payment method'
//                 )
//             );
//         }

//         return right(true);
//     }

//     private async generatePaymentInfo(
//         sale: Sale,
//         request: RequestSalePrePaymentUseCaseRequest
//     ): Promise<PrePaymentInfo> {
//         // 1. Buscar método de pagamento
//         const paymentMethod = await this.paymentService.getPaymentMethod(request.paymentMethod);

//         // 2. Calcular data de expiração
//         const expirationDate = new Date();
//         expirationDate.setHours(expirationDate.getHours() + paymentMethod.expirationHours);

//         // 3. Gerar informações de pagamento baseadas no método
//         const paymentData = await this.paymentService.generatePayment({
//             saleId: sale.id,
//             amount: sale.amount,
//             paymentMethod: paymentMethod.id,
//             expirationDate,
//             customer: {
//                 id: sale.customerId?.toString(),
//                 // Adicionar outras informações necessárias do cliente
//             }
//         });

//         return {
//             expirationDate,
//             paymentUrl: paymentData.paymentUrl,
//             paymentCode: paymentData.paymentCode,
//             qrCode: paymentData.qrCode,
//             amount: sale.amount
//         };
//     }

//     private async registerPaymentRequest(
//         sale: Sale,
//         request: RequestSalePrePaymentUseCaseRequest,
//         paymentInfo: PrePaymentInfo
//     ): Promise<void> {
//         // 1. Registrar na tabela de pagamentos pendentes
//         await this.salesRepository.createPendingPayment({
//             saleId: sale.id,
//             paymentMethod: request.paymentMethod,
//             amount: paymentInfo.amount,
//             expirationDate: paymentInfo.expirationDate,
//             paymentUrl: paymentInfo.paymentUrl,
//             paymentCode: paymentInfo.paymentCode,
//             qrCode: paymentInfo.qrCode,
//             requestedBy: request.requestedBy,
//             requestDate: new Date(),
//             status: 'PENDING'
//         });

//         // 2. Atualizar notas da venda
//         const paymentNote = `[${new Date().toISOString()}] Pré-pagamento solicitado: ${request.paymentMethod}`;
//         sale.notes = sale.notes
//             ? `${sale.notes}\n${paymentNote}`
//             : paymentNote;
//     }
// }