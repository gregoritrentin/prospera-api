// import { Injectable } from '@nestjs/common';
// import { Either, left, right } from '@/core/either';
// import { AppError } from '@/core/errors/app-errors';
// import { Sale, SaleStatus } from '../entities/sale';
// import { SalesRepository } from '../repositories/sales-repository';
// import { StockService } from '@/domain/stock/services/stock.service';
// import { I18nService, Language } from '@/i18n/i18n.service';

// interface StartSaleProcessingUseCaseRequest {
//     saleId: string;
//     startedBy: string; // ID do usuário que está iniciando
//     warehouseId: string; // ID do depósito que vai processar
//     notes?: string;
// }

// interface StockReservation {
//     itemId: string;
//     quantity: number;
//     warehouseId: string;
//     reservationId: string;
// }

// type StartSaleProcessingUseCaseResponse = Either<
//     AppError,
//     {
//         sale: Sale;
//         stockReservations: StockReservation[];
//         message: string;
//     }
// >;

// @Injectable()
// export class StartSaleProcessingUseCase {
//     constructor(
//         private salesRepository: SalesRepository,
//         private stockService: StockService,
//         private i18nService: I18nService
//     ) { }

//     async execute(
//         request: StartSaleProcessingUseCaseRequest,
//         language: Language = 'en-US'
//     ): Promise<StartSaleProcessingUseCaseResponse> {
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
//         if (sale.status !== SaleStatus.APPROVED) {
//             return left(
//                 new AppError(
//                     'errors.INVALID_STATUS_FOR_PROCESSING',
//                     this.i18nService.translate('errors.INVALID_STATUS_FOR_PROCESSING', language, {
//                         status: sale.status
//                     })
//                 )
//             );
//         }

//         try {
//             // 3. Validar disponibilidade de estoque
//             const stockValidation = await this.validateStock(sale, request.warehouseId);
//             if (stockValidation.isLeft()) {
//                 return left(stockValidation.value);
//             }

//             // 4. Realizar reserva de estoque
//             const stockReservations = await this.createStockReservations(sale, request);

//             // 5. Registrar início do processamento
//             await this.registerProcessingStart(sale, request, stockReservations);

//             // 6. Atualizar status da venda
//             const previousStatus = sale.status;
//             sale.status = SaleStatus.IN_PROGRESS;

//             // 7. Registrar histórico
//             await this.salesRepository.createHistory({
//                 saleId: sale.id,
//                 oldStatus: previousStatus,
//                 newStatus: SaleStatus.IN_PROGRESS,
//                 userId: request.startedBy,
//                 date: new Date(),
//                 notes: `Processamento iniciado no depósito ${request.warehouseId}`
//             });

//             // 8. Salvar a venda
//             await this.salesRepository.save(sale);

//             // 9. Iniciar ações de processamento
//             await this.startProcessingActions(sale, stockReservations);

//             return right({
//                 sale,
//                 stockReservations,
//                 message: this.i18nService.translate('messages.PROCESSING_STARTED_SUCCESSFULLY', language)
//             });

//         } catch (error) {
//             // Em caso de erro, tentar reverter as reservas de estoque
//             await this.rollbackStockReservations(sale.id);

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

//     private async validateStock(
//         sale: Sale,
//         warehouseId: string
//     ): Promise<Either<AppError, true>> {
//         const stockValidations = await Promise.all(
//             sale.items.map(async (item) => {
//                 const available = await this.stockService.checkAvailability({
//                     itemId: item.itemId.toString(),
//                     quantity: item.quantity,
//                     warehouseId
//                 });

//                 if (!available) {
//                     return {
//                         itemId: item.itemId.toString(),
//                         available: false
//                     };
//                 }

//                 return {
//                     itemId: item.itemId.toString(),
//                     available: true
//                 };
//             })
//         );

//         const unavailableItems = stockValidations.filter(item => !item.available);
//         if (unavailableItems.length > 0) {
//             return left(
//                 new AppError(
//                     'errors.INSUFFICIENT_STOCK',
//                     `Insufficient stock for items: ${unavailableItems.map(item => item.itemId).join(', ')}`
//                 )
//             );
//         }

//         return right(true);
//     }

//     private async createStockReservations(
//         sale: Sale,
//         request: StartSaleProcessingUseCaseRequest
//     ): Promise<StockReservation[]> {
//         const reservations = await Promise.all(
//             sale.items.map(async (item) => {
//                 const reservation = await this.stockService.createReservation({
//                     saleId: sale.id.toString(),
//                     itemId: item.itemId.toString(),
//                     quantity: item.quantity,
//                     warehouseId: request.warehouseId,
//                     requestedBy: request.startedBy
//                 });

//                 return {
//                     itemId: item.itemId.toString(),
//                     quantity: item.quantity,
//                     warehouseId: request.warehouseId,
//                     reservationId: reservation.id
//                 };
//             })
//         );

//         return reservations;
//     }

//     private async registerProcessingStart(
//         sale: Sale,
//         request: StartSaleProcessingUseCaseRequest,
//         stockReservations: StockReservation[]
//     ): Promise<void> {
//         await this.salesRepository.createProcessing({
//             saleId: sale.id,
//             warehouseId: request.warehouseId,
//             startedBy: request.startedBy,
//             startDate: new Date(),
//             status: 'IN_PROGRESS',
//             stockReservations: stockReservations,
//             notes: request.notes
//         });

//         // Atualizar notas da venda
//         const processingNote = `[${new Date().toISOString()}] Processamento iniciado: Depósito ${request.warehouseId}`;
//         sale.notes = sale.notes
//             ? `${sale.notes}\n${processingNote}`
//             : processingNote;
//     }

//     private async startProcessingActions(
//         sale: Sale,
//         stockReservations: StockReservation[]
//     ): Promise<void> {
//         try {
//             // 1. Gerar ordem de separação
//             await this.generatePickingOrder(sale, stockReservations);

//             // 2. Notificar equipe do depósito
//             await this.notifyWarehouseTeam(sale);

//             // 3. Atualizar indicadores de processamento
//             await this.updateProcessingMetrics(sale);

//         } catch (error) {
//             // Registrar erro mas não interromper o fluxo
//             console.error('Error in post-processing actions:', error);
//         }
//     }

//     private async rollbackStockReservations(saleId: string): Promise<void> {
//         try {
//             await this.stockService.cancelReservationsBySale(saleId);
//         } catch (error) {
//             // Registrar erro de rollback para ação manual
//             console.error('Error rolling back stock reservations:', error);
//         }
//     }

//     private async generatePickingOrder(sale: Sale, stockReservations: StockReservation[]): Promise<void> {
//         // Implementar geração da ordem de separação
//     }

//     private async notifyWarehouseTeam(sale: Sale): Promise<void> {
//         // Implementar notificação da equipe
//     }

//     private async updateProcessingMetrics(sale: Sale): Promise<void> {
//         // Implementar atualização de métricas
//     }
// }