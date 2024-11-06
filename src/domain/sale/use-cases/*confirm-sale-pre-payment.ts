// import { Injectable } from '@nestjs/common';
// import { Either, left, right } from '@/core/either';
// import { AppError } from '@/core/errors/app-errors';
// import { Sale, SaleStatus } from '../entities/sale';
// import { SalesRepository } from '../repositories/sales-repository';
// import { I18nService, Language } from '@/i18n/i18n.service';

// interface ConfirmSalePaymentUseCaseRequest {
//     saleId: string;
//     paymentId: string;
//     paymentDate: Date;
//     paymentAmount: number;
//     paymentMethod: string;
//     confirmedBy: string; // ID do usuário que está confirmando
//     notes?: string;
// }

// type ConfirmSalePaymentUseCaseResponse = Either<
//     AppError,
//     {
//         sale: Sale;
//         message: string;
//     }
// >;

// @Injectable()
// export class ConfirmSalePaymentUseCase {
//     constructor(
//         private salesRepository: SalesRepository,
//         private i18nService: I18nService
//     ) { }

//     async execute(
//         request: ConfirmSalePaymentUseCaseRequest,
//         language: Language = 'en-US'
//     ): Promise<ConfirmSalePaymentUseCaseResponse> {
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
//         if (sale.status !== SaleStatus.WAITING_PREPAYMENT) {
//             return left(
//                 new AppError(
//                     'errors.INVALID_STATUS_FOR_PAYMENT_CONFIRMATION',
//                     this.i18nService.translate('errors.INVALID_STATUS_FOR_PAYMENT_CONFIRMATION', language, {
//                         status: sale.status
//                     })
//                 )
//             );
//         }

//         try {
//             // 3. Validar o pagamento
//             const validationResult = await this.validatePayment(sale, request);
//             if (validationResult.isLeft()) {
//                 return left(validationResult.value);
//             }

//             // 4. Registrar o pagamento
//             await this.registerPayment(sale, request);

//             // 5. Atualizar o status para APPROVED
//             const previousStatus = sale.status;
//             sale.status = SaleStatus.APPROVED;

//             // 6. Registrar histórico
//             await this.salesRepository.createHistory({
//                 saleId: sale.id,
//                 oldStatus: previousStatus,
//                 newStatus: SaleStatus.APPROVED,
//                 userId: request.confirmedBy,
//                 date: new Date(),
//                 notes: `Pagamento confirmado: ${request.paymentMethod} - ${request.paymentId}`
//             });

//             // 7. Executar ações pós-confirmação
//             await this.executePostConfirmationActions(sale, request);

//             // 8. Salvar a venda
//             await this.salesRepository.save(sale);

//             return right({
//                 sale,
//                 message: this.i18nService.translate('messages.PAYMENT_CONFIRMED_SUCCESSFULLY', language)
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

//     private async validatePayment(
//         sale: Sale,
//         request: ConfirmSalePaymentUseCaseRequest
//     ): Promise<Either<AppError, true>> {
//         // Validar se o valor pago corresponde ao valor da venda
//         if (Math.abs(sale.amount - request.paymentAmount) > 0.01) {
//             return left(
//                 new AppError(
//                     'errors.PAYMENT_AMOUNT_MISMATCH',
//                     'Payment amount does not match sale amount'
//                 )
//             );
//         }

//         // Validar se a data do pagamento não é futura
//         if (request.paymentDate > new Date()) {
//             return left(
//                 new AppError(
//                     'errors.INVALID_PAYMENT_DATE',
//                     'Payment date cannot be in the future'
//                 )
//             );
//         }

//         // Validar se não existe outro pagamento já confirmado
//         const existingPayment = await this.salesRepository.findPaymentBySaleId(sale.id);
//         if (existingPayment) {
//             return left(
//                 new AppError(
//                     'errors.PAYMENT_ALREADY_CONFIRMED',
//                     'Payment already confirmed for this sale'
//                 )
//             );
//         }

//         return right(true);
//     }

//     private async registerPayment(
//         sale: Sale,
//         request: ConfirmSalePaymentUseCaseRequest
//     ): Promise<void> {
//         await this.salesRepository.createPayment({
//             saleId: sale.id,
//             paymentId: request.paymentId,
//             paymentDate: request.paymentDate,
//             paymentAmount: request.paymentAmount,
//             paymentMethod: request.paymentMethod,
//             confirmedBy: request.confirmedBy,
//             notes: request.notes
//         });

//         // Atualizar notas da venda
//         const paymentNote = `[${new Date().toISOString()}] Pagamento confirmado: ${request.paymentMethod} - ${request.paymentId}`;
//         sale.notes = sale.notes
//             ? `${sale.notes}\n${paymentNote}`
//             : paymentNote;
//     }

//     private async executePostConfirmationActions(
//         sale: Sale,
//         request: ConfirmSalePaymentUseCaseRequest
//     ): Promise<void> {
//         // Aqui você pode adicionar ações como:
//         // 1. Enviar notificação ao cliente
//         // 2. Atualizar relatórios financeiros
//         // 3. Sincronizar com sistema financeiro
//         // 4. Iniciar processo de separação
//         // 5. Outras ações necessárias
//     }
// }