// import { Injectable } from '@nestjs/common';
// import { Either, left, right } from '@/core/either';
// import { AppError } from '@/core/errors/app-errors';
// import { Sale, SaleStatus } from '../entities/sale';
// import { SalesRepository } from '../repositories/sales-repository';
// import { StockService } from '@/domain/stock/services/stock.service';
// import { InvoiceRepository } from '../repositories/invoice-repository';
// import { I18nService, Language } from '@/i18n/i18n.service';

// interface ReturnItemRequest {
//     saleItemId: string;
//     quantity: number;
//     reason: string;
//     condition: 'GOOD' | 'DAMAGED' | 'INCOMPLETE';
// }

// interface ReturnSaleUseCaseRequest {
//     saleId: string;
//     warehouseId: string;
//     returnedBy: string;
//     returnDate: Date;
//     items: ReturnItemRequest[];
//     notes?: string;
//     returnReason: string;
// }

// interface ReturnedItem {
//     itemId: string;
//     quantity: number;
//     condition: string;
//     warehouseId: string;
//     stockMovementId: string;
// }

// type ReturnSaleUseCaseResponse = Either<
//     AppError,
//     {
//         sale: Sale;
//         returnedItems: ReturnedItem[];
//         message: string;
//     }
// >;

// @Injectable()
// export class ReturnSaleUseCase {
//     constructor(
//         private salesRepository: SalesRepository,
//         private invoiceRepository: InvoiceRepository,
//         private stockService: StockService,
//         private i18nService: I18nService
//     ) { }

//     async execute(
//         request: ReturnSaleUseCaseRequest,
//         language: Language = 'en-US'
//     ): Promise<ReturnSaleUseCaseResponse> {
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
//         if (sale.status !== SaleStatus.INVOICED) {
//             return left(
//                 new AppError(
//                     'errors.INVALID_STATUS_FOR_RETURN',
//                     this.i18nService.translate('errors.INVALID_STATUS_FOR_RETURN', language, {
//                         status: sale.status
//                     })
//                 )
//             );
//         }

//         try {
//             // 3. Validar itens da devolução
//             const validationResult = await this.validateReturnItems(sale, request.items);
//             if (validationResult.isLeft()) {
//                 return left(validationResult.value);
//             }

//             // 4. Criar registro de devolução
//             const returnRecord = await this.createReturnRecord(sale, request);

//             // 5. Processar devolução dos itens ao estoque
//             const returnedItems = await this.processStockReturn(returnRecord, request);

//             // 6. Verificar se precisa cancelar/ajustar fatura
//             await this.handleInvoiceAdjustment(sale, returnRecord);

//             // 7. Atualizar status da venda
//             const previousStatus = sale.status;
//             sale.status = SaleStatus.RETURNED;

//             // 8. Registrar histórico
//             await this.salesRepository.createHistory({
//                 saleId: sale.id,
//                 oldStatus: previousStatus,
//                 newStatus: SaleStatus.RETURNED,
//                 userId: request.returnedBy,
//                 date: request.returnDate,
//                 notes: `Venda devolvida: ${request.returnReason}`
//             });

//             // 9. Salvar a venda
//             await this.salesRepository.save(sale);

//             // 10. Executar ações pós-devolução
//             await this.executePostReturnActions(sale, returnRecord, returnedItems);

//             return right({
//                 sale,
//                 returnedItems,
//                 message: this.i18nService.translate('messages.SALE_RETURNED_SUCCESSFULLY', language)
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

//     private async validateReturnItems(
//         sale: Sale,
//         returnItems: ReturnItemRequest[]
//     ): Promise<Either<AppError, true>> {
//         // 1. Verificar se todos os itens pertencem à venda
//         const saleItemIds = sale.items.map(item => item.id.toString());
//         const invalidItems = returnItems.filter(
//             item => !saleItemIds.includes(item.saleItemId)
//         );

//         if (invalidItems.length > 0) {
//             return left(new AppError('errors.INVALID_RETURN_ITEMS'));
//         }

//         // 2. Verificar quantidades
//         for (const returnItem of returnItems) {
//             const saleItem = sale.items.find(
//                 item => item.id.toString() === returnItem.saleItemId
//             );

//             if (!saleItem) continue;

//             if (returnItem.quantity > saleItem.quantity) {
//                 return left(
//                     new AppError(
//                         'errors.INVALID_RETURN_QUANTITY',
//                         `Return quantity exceeds sold quantity for item ${saleItem.itemId}`
//                     )
//                 );
//             }
//         }

//         return right(true);
//     }

//     private async createReturnRecord(
//         sale: Sale,
//         request: ReturnSaleUseCaseRequest
//     ) {
//         return this.salesRepository.createReturn({
//             saleId: sale.id,
//             returnDate: request.returnDate,
//             returnedBy: request.returnedBy,
//             warehouseId: request.warehouseId,
//             reason: request.returnReason,
//             notes: request.notes,
//             items: request.items.map(item => ({
//                 saleItemId: item.saleItemId,
//                 quantity: item.quantity,
//                 reason: item.reason,
//                 condition: item.condition
//             }))
//         });
//     }

//     private async processStockReturn(
//         returnRecord: SaleReturn,
//         request: ReturnSaleUseCaseRequest
//     ): Promise<ReturnedItem[]> {
//         const returnedItems: ReturnedItem[] = [];

//         for (const item of request.items) {
//             const stockMovement = await this.stockService.createReturn({
//                 returnId: returnRecord.id,
//                 saleItemId: item.saleItemId,
//                 quantity: item.quantity,
//                 condition: item.condition,
//                 warehouseId: request.warehouseId,
//                 returnedBy: request.returnedBy,
//                 returnDate: request.returnDate
//             });

//             returnedItems.push({
//                 itemId: item.saleItemId,
//                 quantity: item.quantity,
//                 condition: item.condition,
//                 warehouseId: request.warehouseId,
//                 stockMovementId: stockMovement.id
//             });
//         }

//         return returnedItems;
//     }

//     private async handleInvoiceAdjustment(sale: Sale, returnRecord: SaleReturn): Promise<void> {
//         // Buscar fatura relacionada
//         const invoice = await this.invoiceRepository.findBySaleId(sale.id);
//         if (!invoice) return;

//         // Criar nota de crédito ou ajuste fiscal necessário
//         await this.invoiceRepository.createCreditNote({
//             invoiceId: invoice.id,
//             returnId: returnRecord.id,
//             amount: this.calculateReturnAmount(returnRecord.items),
//             reason: returnRecord.reason
//         });
//     }

//     private calculateReturnAmount(returnItems: SaleReturnItem[]): number {
//         return returnItems.reduce((total, item) => {
//             const originalItem = sale.items.find(
//                 saleItem => saleItem.id.toString() === item.saleItemId
//             );
//             if (!originalItem) return total;

//             const itemTotal = (item.quantity * originalItem.unitPrice) -
//                 (item.quantity * (originalItem.discountAmount / originalItem.quantity));
//             return total + itemTotal;
//         }, 0);
//     }

//     private async executePostReturnActions(
//         sale: Sale,
//         returnRecord: SaleReturn,
//         returnedItems: ReturnedItem[]
//     ): Promise<void> {
//         try {
//             // 1. Notificar partes interessadas
//             await this.notifyReturn(sale, returnRecord);

//             // 2. Atualizar métricas de devolução
//             await this.updateReturnMetrics(returnRecord);

//             // 3. Gerar documentação necessária
//             await this.generateReturnDocuments(sale, returnRecord);

//             // 4. Iniciar processo de reembolso se necessário
//             await this.initiateRefundProcess(sale, returnRecord);

//         } catch (error) {
//             // Log do erro, mas não impede o fluxo principal
//             console.error('Error in post-return actions:', error);
//         }
//     }

//     private async notifyReturn(sale: Sale, returnRecord: SaleReturn): Promise<void> {
//         // Implementar notificações
//     }

//     private async updateReturnMetrics(returnRecord: SaleReturn): Promise<void> {
//         // Implementar atualização de métricas
//     }

//     private async generateReturnDocuments(
//         sale: Sale,
//         returnRecord: SaleReturn
//     ): Promise<void> {
//         // Implementar geração de documentos
//     }

//     private async initiateRefundProcess(
//         sale: Sale,
//         returnRecord: SaleReturn
//     ): Promise<void> {
//         // Implementar processo de reembolso
//     }
// }