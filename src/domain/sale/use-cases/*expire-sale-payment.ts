// import { Injectable } from '@nestjs/common';
// import { Either, left, right } from '@/core/either';
// import { AppError } from '@/core/errors/app-errors';
// import { Sale, SaleStatus } from '../entities/sale';
// import { SalesRepository } from '../repositories/sales-repository';
// import { I18nService, Language } from '@/i18n/i18n.service';

// interface ExpireSalePaymentUseCaseRequest {
//     saleId: string;
//     expiredBy: string; // ID do usuário ou sistema que está expirando
//     reason?: string;
// }

// type ExpireSalePaymentUseCaseResponse = Either<
//     AppError,
//     {
//         sale: Sale;
//         message: string;
//     }
// >;

// @Injectable()
// export class ExpireSalePaymentUseCase {
//     constructor(
//         private salesRepository: SalesRepository,
//         private i18nService: I18nService
//     ) { }

//     async execute(
//         request: ExpireSalePaymentUseCaseRequest,
//         language: Language = 'en-US'
//     ): Promise<ExpireSalePaymentUseCaseResponse> {
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
//                     'errors.INVALID_STATUS_FOR_PAYMENT_EXPIRATION',
//                     this.i18nService.translate('errors.INVALID_STATUS_FOR_PAYMENT_EXPIRATION', language, {
//                         status: sale.status
//                     })
//                 )
//             );
//         }

//         try {
//             // 3. Validar se o pagamento realmente expirou
//             const validationResult = await this.validateExpiration(sale);
//             if (validationResult.isLeft()) {
//                 return left(validationResult.value);
//             }

//             // 4. Registrar a expiração
//             await this.registerExpiration(sale, request);

//             // 5. Atualizar o status para PAYMENT_EXPIRED
//             const previousStatus = sale.status;
//             sale.status = SaleStatus.PAYMENT_EXPIRED;

//             // 6. Registrar histórico
//             await this.salesRepository.createHistory({
//                 saleId: sale.id,
//                 oldStatus: previousStatus,
//                 newStatus: SaleStatus.PAYMENT_EXPIRED,
//                 userId: request.expiredBy,
//                 date: new Date(),
//                 notes: request.reason || 'Payment deadline expired'
//             });

//             // 7. Executar ações pós-expiração
//             await this.executePostExpirationActions(sale);

//             // 8. Salvar a venda
//             await this.salesRepository.save(sale);

//             // 9. Retornar sucesso
//             return right({
//                 sale,
//                 message: this.i18nService.translate('messages.PAYMENT_EXPIRED_SUCCESSFULLY', language)
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

//     private async validateExpiration(sale: Sale): Promise<Either<AppError, true>> {
//         // Buscar configuração de prazo de pagamento (pode vir de configurações do sistema)
//         const paymentDeadlineHours = 48; // Por exemplo, 48 horas

//         // Calcular tempo decorrido desde a mudança para WAITING_PREPAYMENT
//         const lastStatusChange = await this.salesRepository.getLastStatusChange(sale.id);
//         if (!lastStatusChange) {
//             return left(new AppError('errors.STATUS_HISTORY_NOT_FOUND'));
//         }

//         const hoursElapsed = this.calculateHoursElapsed(lastStatusChange.date);

//         // Se não excedeu o prazo, não pode expirar
//         if (hoursElapsed < paymentDeadlineHours) {
//             return left(
//                 new AppError(
//                     'errors.PAYMENT_DEADLINE_NOT_EXPIRED',
//                     `Payment deadline has not expired yet. Hours remaining: ${paymentDeadlineHours - hoursElapsed}`
//                 )
//             );
//         }

//         // Verificar se não existe pagamento em processamento
//         const pendingPayment = await this.salesRepository.findPendingPayment(sale.id);
//         if (pendingPayment) {
//             return left(
//                 new AppError(
//                     'errors.PENDING_PAYMENT_EXISTS',
//                     'There is a payment being processed'
//                 )
//             );
//         }

//         return right(true);
//     }

//     private calculateHoursElapsed(date: Date): number {
//         const now = new Date();
//         const diffInMilliseconds = now.getTime() - date.getTime();
//         return diffInMilliseconds / (1000 * 60 * 60);
//     }

//     private async registerExpiration(
//         sale: Sale,
//         request: ExpireSalePaymentUseCaseRequest
//     ): Promise<void> {
//         // Registrar expiração nas notas da venda
//         const expirationNote = `[${new Date().toISOString()}] Pagamento expirado: ${request.reason || 'Prazo de pagamento excedido'
//             }`;

//         sale.notes = sale.notes
//             ? `${sale.notes}\n${expirationNote}`
//             : expirationNote;
//     }

//     private async executePostExpirationActions(sale: Sale): Promise<void> {
//         try {
//             // 1. Cancelar qualquer reserva de produto se houver
//             await this.releaseStockReservations(sale);

//             // 2. Notificar o cliente
//             await this.notifyCustomer(sale);

//             // 3. Notificar o vendedor
//             await this.notifySalesPerson(sale);

//             // 4. Registrar métricas de expiração
//             await this.registerExpirationMetrics(sale);

//         } catch (error) {
//             // Log do erro, mas não impede o fluxo principal
//             console.error('Error in post-expiration actions:', error);
//         }
//     }

//     private async releaseStockReservations(sale: Sale): Promise<void> {
//         // Implementar liberação de reservas de estoque
//     }

//     private async notifyCustomer(sale: Sale): Promise<void> {
//         // Implementar notificação ao cliente
//     }

//     private async notifySalesPerson(sale: Sale): Promise<void> {
//         // Implementar notificação ao vendedor
//     }

//     private async registerExpirationMetrics(sale: Sale): Promise<void> {
//         // Implementar registro de métricas
//     }
// }