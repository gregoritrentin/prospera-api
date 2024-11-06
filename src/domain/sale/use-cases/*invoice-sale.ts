// import { Injectable } from '@nestjs/common';
// import { Either, left, right } from '@/core/either';
// import { AppError } from '@/core/errors/app-errors';
// import { InvoiceRepository } from '../repositories/invoice-repository';
// import { SalesRepository } from '../repositories/sales-repository';
// import { Invoice, InvoiceStatus } from '../entities/invoice';
// import { Sale, SaleStatus } from '../entities/sale';
// import { PaymentService } from '@/domain/payment/services/payment.service';
// import { I18nService, Language } from '@/i18n/i18n.service';

// interface CreateInvoiceUseCaseRequest {
//     customerId: string;
//     saleIds: string[];
//     issueDate: Date;
//     dueDate: Date;
//     paymentMethod?: string;
//     installments?: number;
//     notes?: string;
//     createdBy: string;
// }

// type CreateInvoiceUseCaseResponse = Either<
//     AppError,
//     {
//         invoice: Invoice;
//         paymentInfo?: any; // Informações de pagamento se aplicável
//         message: string;
//     }
// >;

// interface GroupedItems {
//     itemId: string;
//     quantity: number;
//     unitPrice: number;
//     discountAmount: number;
//     totalPrice: number;
//     description: string;
// }

// @Injectable()
// export class CreateInvoiceUseCase {
//     constructor(
//         private salesRepository: SalesRepository,
//         private invoiceRepository: InvoiceRepository,
//         private paymentService: PaymentService,
//         private i18nService: I18nService
//     ) { }

//     async execute(
//         request: CreateInvoiceUseCaseRequest,
//         language: Language = 'en-US'
//     ): Promise<CreateInvoiceUseCaseResponse> {
//         // 1. Validar vendas
//         const validationResult = await this.validateSales(request.saleIds, request.customerId);
//         if (validationResult.isLeft()) {
//             return left(validationResult.value);
//         }

//         const sales = validationResult.value;

//         try {
//             // 2. Coletar e validar pré-pagamentos
//             const prePayments = await this.collectPrePayments(request.saleIds);
//             const totalPrePaid = this.calculateTotalPrePaid(prePayments);

//             // 3. Agrupar itens das vendas
//             const groupedItems = this.groupSaleItems(sales);

//             // 4. Calcular totais
//             const totals = this.calculateTotals(sales);

//             // 5. Criar fatura
//             const invoice = await this.invoiceRepository.create({
//                 customerId: request.customerId,
//                 issueDate: request.issueDate,
//                 dueDate: request.dueDate,
//                 status: InvoiceStatus.DRAFT,
//                 totalAmount: totals.totalAmount,
//                 paidAmount: totalPrePaid,
//                 remainingAmount: totals.totalAmount - totalPrePaid,
//                 servicesAmount: totals.servicesAmount,
//                 productsAmount: totals.productsAmount,
//                 discountAmount: totals.discountAmount,
//                 notes: request.notes,
//                 createdBy: request.createdBy
//             });

//             // 6. Criar relações com as vendas
//             await this.createInvoiceSales(invoice.id, sales);

//             // 7. Criar itens agrupados
//             await this.createInvoiceItems(invoice.id, groupedItems);

//             // 8. Processar pré-pagamentos
//             if (totalPrePaid > 0) {
//                 await this.processPrePayments(invoice.id, prePayments);
//             }

//             // 9. Gerar pagamento para valor restante se necessário
//             let paymentInfo = null;
//             if (invoice.remainingAmount > 0 && request.paymentMethod) {
//                 paymentInfo = await this.generatePayment(invoice, {
//                     method: request.paymentMethod,
//                     installments: request.installments
//                 });
//             }

//             // 10. Atualizar status das vendas
//             await this.updateSalesStatus(sales);

//             // 11. Criar histórico
//             await this.createInvoiceHistory(invoice, request.createdBy);

//             return right({
//                 invoice,
//                 paymentInfo,
//                 message: this.i18nService.translate('messages.INVOICE_CREATED_SUCCESSFULLY', language)
//             });

//         } catch (error) {
//             // Em caso de erro, tentar reverter as mudanças
//             await this.rollbackInvoiceCreation(sales);

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

//     private async validateSales(
//         saleIds: string[],
//         customerId: string
//     ): Promise<Either<AppError, Sale[]>> {
//         // 1. Buscar todas as vendas
//         const sales = await this.salesRepository.findByIds(saleIds);

//         // 2. Verificar se todas as vendas foram encontradas
//         if (sales.length !== saleIds.length) {
//             return left(new AppError('errors.SALES_NOT_FOUND'));
//         }

//         // 3. Verificar se todas são do mesmo cliente
//         const hasInvalidCustomer = sales.some(sale =>
//             sale.customerId?.toString() !== customerId
//         );
//         if (hasInvalidCustomer) {
//             return left(new AppError('errors.SALES_FROM_DIFFERENT_CUSTOMERS'));
//         }

//         // 4. Verificar se todas estão no status correto
//         const hasInvalidStatus = sales.some(sale =>
//             sale.status !== SaleStatus.APPROVED_TO_INVOICE
//         );
//         if (hasInvalidStatus) {
//             return left(new AppError('errors.SALES_WITH_INVALID_STATUS'));
//         }

//         // 5. Verificar se alguma já está em outra fatura
//         const hasExistingInvoice = await this.invoiceRepository.checkSalesInvoiced(saleIds);
//         if (hasExistingInvoice) {
//             return left(new AppError('errors.SALES_ALREADY_INVOICED'));
//         }

//         return right(sales);
//     }

//     private async collectPrePayments(saleIds: string[]): Promise<SalePrePayment[]> {
//         const prePayments = await this.salesRepository.findConfirmedPrePayments(saleIds);
//         return prePayments.filter(payment =>
//             payment.status === SalePrePaymentStatus.CONFIRMED
//         );
//     }

//     private calculateTotalPrePaid(prePayments: SalePrePayment[]): number {
//         return prePayments.reduce((total, payment) => total + payment.amount, 0);
//     }

//     private groupSaleItems(sales: Sale[]): GroupedItems[] {
//         const itemsMap = new Map<string, GroupedItems>();

//         sales.forEach(sale => {
//             sale.items.forEach(item => {
//                 const key = item.itemId.toString();
//                 const existing = itemsMap.get(key);

//                 if (existing) {
//                     existing.quantity += item.quantity;
//                     existing.discountAmount += item.discountAmount;
//                     existing.totalPrice += item.totalPrice;
//                 } else {
//                     itemsMap.set(key, {
//                         itemId: key,
//                         quantity: item.quantity,
//                         unitPrice: item.unitPrice,
//                         discountAmount: item.discountAmount,
//                         totalPrice: item.totalPrice,
//                         description: item.itemDescription
//                     });
//                 }
//             });
//         });

//         return Array.from(itemsMap.values());
//     }

//     private calculateTotals(sales: Sale[]) {
//         return sales.reduce((acc, sale) => ({
//             totalAmount: acc.totalAmount + sale.amount,
//             servicesAmount: acc.servicesAmount + sale.servicesAmount,
//             productsAmount: acc.productsAmount + sale.productAmount,
//             discountAmount: acc.discountAmount + sale.discountAmount
//         }), {
//             totalAmount: 0,
//             servicesAmount: 0,
//             productsAmount: 0,
//             discountAmount: 0
//         });
//     }

//     private async createInvoiceSales(invoiceId: string, sales: Sale[]): Promise<void> {
//         await Promise.all(
//             sales.map(sale =>
//                 this.invoiceRepository.createInvoiceSale({
//                     invoiceId,
//                     saleId: sale.id,
//                     amount: sale.amount
//                 })
//             )
//         );
//     }

//     private async createInvoiceItems(
//         invoiceId: string,
//         items: GroupedItems[]
//     ): Promise<void> {
//         await Promise.all(
//             items.map(item =>
//                 this.invoiceRepository.createInvoiceItem({
//                     invoiceId,
//                     itemId: item.itemId,
//                     quantity: item.quantity,
//                     unitPrice: item.unitPrice,
//                     discountAmount: item.discountAmount,
//                     totalPrice: item.totalPrice,
//                     description: item.description
//                 })
//             )
//         );
//     }

//     private async processPrePayments(
//         invoiceId: string,
//         prePayments: SalePrePayment[]
//     ): Promise<void> {
//         // Criar pagamento na fatura para pré-pagamentos
//         const invoicePayment = await this.invoiceRepository.createPayment({
//             invoiceId,
//             amount: this.calculateTotalPrePaid(prePayments),
//             paymentMethod: 'PRE_PAYMENT',
//             paymentDate: new Date(),
//             status: InvoicePaymentStatus.CONFIRMED
//         });

//         // Vincular pré-pagamentos
//         await Promise.all(
//             prePayments.map(prePay =>
//                 this.salesRepository.updatePrePayment({
//                     id: prePay.id,
//                     status: SalePrePaymentStatus.APPLIED_TO_INVOICE,
//                     appliedInvoicePaymentId: invoicePayment.id
//                 })
//             )
//         );
//     }

//     private async generatePayment(
//         invoice: Invoice,
//         paymentConfig: { method: string; installments?: number }
//     ): Promise<any> {
//         return this.paymentService.generatePayment({
//             invoiceId: invoice.id,
//             amount: invoice.remainingAmount,
//             paymentMethod: paymentConfig.method,
//             installments: paymentConfig.installments,
//             dueDate: invoice.dueDate
//         });
//     }

//     private async updateSalesStatus(sales: Sale[]): Promise<void> {
//         await Promise.all(
//             sales.map(sale => {
//                 sale.status = SaleStatus.INVOICED;
//                 return this.salesRepository.save(sale);
//             })
//         );
//     }

//     private async createInvoiceHistory(
//         invoice: Invoice,
//         userId: string
//     ): Promise<void> {
//         await this.invoiceRepository.createHistory({
//             invoiceId: invoice.id,
//             status: invoice.status,
//             userId,
//             date: new Date(),
//             notes: 'Invoice created'
//         });
//     }

//     private async rollbackInvoiceCreation(sales: Sale[]): Promise<void> {
//         try {
//             // Reverter status das vendas
//             await Promise.all(
//                 sales.map(sale => {
//                     sale.status = SaleStatus.APPROVED_TO_INVOICE;
//                     return this.salesRepository.save(sale);
//                 })
//             );
//         } catch (error) {
//             console.error('Error rolling back invoice creation:', error);
//         }
//     }
// }