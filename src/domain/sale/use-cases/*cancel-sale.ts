// import { Injectable } from '@nestjs/common';
// import { Either, left, right } from '@/core/either';
// import { AppError } from '@/core/errors/app-errors';
// import { Sale, SaleStatus } from '../entities/sale';
// import { SalesRepository } from '../repositories/sales-repository';
// import { I18nService, Language } from '@/i18n/i18n.service';

// interface CancelSaleUseCaseRequest {
//     saleId: string;
//     cancelReason: string;
//     canceledBy: string; // ID do usuário que está cancelando
// }

// type CancelSaleUseCaseResponse = Either<
//     AppError,
//     {
//         sale: Sale;
//         message: string;
//     }
// >;

// @Injectable()
// export class CancelSaleUseCase {
//     // Status que permitem cancelamento
//     private cancelableStatus = [
//         SaleStatus.DRAFT,
//         SaleStatus.CREDIT_ANALYSIS,
//         SaleStatus.APPROVED,
//         SaleStatus.CREDIT_DENIED,
//         SaleStatus.WAITING_PREPAYMENT,
//         SaleStatus.IN_PROGRESS,
//         SaleStatus.APPROVED_TO_INVOICE,
//         SaleStatus.PAYMENT_EXPIRED
//     ];

//     constructor(
//         private salesRepository: SalesRepository,
//         private i18nService: I18nService
//     ) { }

//     async execute(
//         request: CancelSaleUseCaseRequest,
//         language: Language = 'en-US'
//     ): Promise<CancelSaleUseCaseResponse> {
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

//         // 2. Validar se o status atual permite cancelamento
//         if (!this.cancelableStatus.includes(sale.status)) {
//             return left(
//                 new AppError(
//                     'errors.CANNOT_CANCEL_SALE',
//                     this.i18nService.translate('errors.CANNOT_CANCEL_SALE', language, {
//                         status: sale.status
//                     })
//                 )
//             );
//         }

//         try {
//             // 3. Executar validações específicas baseadas no status atual
//             const validationResult = await this.validateCancellation(sale);
//             if (validationResult.isLeft()) {
//                 return left(validationResult.value);
//             }

//             // 4. Registrar informações do cancelamento
//             await this.registerCancellation(sale, request);

//             // 5. Atualizar o status para CANCELED
//             sale.status = SaleStatus.CANCELED;

//             // 6. Executar ações necessárias baseadas no status anterior
//             await this.executePostCancellationActions(sale);

//             // 7. Salvar a venda
//             await this.salesRepository.save(sale);

//             return right({
//                 sale,
//                 message: this.i18nService.translate('messages.SALE_CANCELED_SUCCESSFULLY', language)
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

//     private async validateCancellation(sale: Sale): Promise<Either<AppError, true>> {
//         switch (sale.status) {
//             case SaleStatus.APPROVED_TO_INVOICE:
//                 // Verificar se já existe nota fiscal em processamento
//                 const hasInvoiceInProgress = await this.checkInvoiceInProgress(sale);
//                 if (hasInvoiceInProgress) {
//                     return left(new AppError('errors.INVOICE_IN_PROGRESS'));
//                 }
//                 break;

//             case SaleStatus.IN_PROGRESS:
//                 // Verificar se já existe separação em andamento
//                 const hasProcessingInProgress = await this.checkProcessingInProgress(sale);
//                 if (hasProcessingInProgress) {
//                     return left(new AppError('errors.PROCESSING_IN_PROGRESS'));
//                 }
//                 break;
//         }

//         return right(true);
//     }

//     private async registerCancellation(sale: Sale, request: CancelSaleUseCaseRequest): Promise<void> {
//         // Registrar histórico de cancelamento
//         await this.salesRepository.createHistory({
//             saleId: sale.id,
//             oldStatus: sale.status,
//             newStatus: SaleStatus.CANCELED,
//             reason: request.cancelReason,
//             userId: request.canceledBy,
//             date: new Date()
//         });

//         // Atualizar notas da venda com a razão do cancelamento
//         sale.notes = `${sale.notes || ''}\n[${new Date().toISOString()}] Cancelado: ${request.cancelReason}`;
//     }

//     private async executePostCancellationActions(sale: Sale): Promise<void> {
//         switch (sale.status) {
//             case SaleStatus.APPROVED:
//             case SaleStatus.IN_PROGRESS:
//                 // Liberar reservas de estoque se houverem
//                 await this.releaseStockReservations(sale);
//                 break;

//             case SaleStatus.WAITING_PREPAYMENT:
//                 // Registrar cancelamento do pagamento se houver pagamento pendente
//                 await this.cancelPendingPayment(sale);
//                 break;

//             case SaleStatus.APPROVED_TO_INVOICE:
//                 // Cancelar processamento de nota fiscal se houver
//                 await this.cancelInvoiceProcessing(sale);
//                 break;
//         }
//     }

//     private async checkInvoiceInProgress(sale: Sale): Promise<boolean> {
//         // Implementar verificação de nota fiscal em processamento
//         return false;
//     }

//     private async checkProcessingInProgress(sale: Sale): Promise<boolean> {
//         // Implementar verificação de processamento em andamento
//         return false;
//     }

//     private async releaseStockReservations(sale: Sale): Promise<void> {
//         // Implementar liberação de reservas de estoque
//     }

//     private async cancelPendingPayment(sale: Sale): Promise<void> {
//         // Implementar cancelamento de pagamento pendente
//     }

//     private async cancelInvoiceProcessing(sale: Sale): Promise<void> {
//         // Implementar cancelamento de processamento de nota fiscal
//     }
// }