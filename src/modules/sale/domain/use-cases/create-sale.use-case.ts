import { Injectable } from '@nestjs/common'
import { Sale } from '@/modules/sa/domain/entiti/sale'
import { SaleItem } from '@/modules/sa/domain/entiti/sale-item'
import { SalesRepository } from '@/modules/sa/domain/repositori/sales-repository'

import { Either, left, right } from @core/co@core/either';
import { I18nService, Language } from @core/i1@core/i18n.service';
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id';
import { AppError } from @core/co@core/erro@core/app-errors';
import { SaleStatus } from @core/co@core/typ@core/enums';

interface SaleItemRequest {
    itemId: string;
    itemDescription: string;
    quantity: number;
    unitPrice: number;
    discountAmount: number;
    commissionAmount: number;
}

interface CreateSaleUseCaseRequest {
    businessId: string;
    customerId?: string;
    ownerId: string;
    salesPersonId: string;
    channelId?: string;
    issueDate: Date;
    status: SaleStatus;
    notes?: string | null;
    items: SaleItemRequest[];
}

type CreateSaleUseCaseResponse = Either<
    AppError,
    {
        sale: Sale;
        message: string;
    }
>;

@Injectable()
export class CreateSaleUseCase {
    constructor(
        private salesRepository: SalesRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: CreateSaleUseCaseRequest,
        language: Language = 'en-US'
    ): Promise<CreateSaleUseCaseResponse> {

        const validationResult = this.validateSale(request, language);
        if (validationResult !== true) {
            return left(validationResult);
        }

        const sale = this.createSaleEntity(request);

        await this.salesRepository.create(sale);

        const successMessage = this.i18nService.translate('messages.RECORD_CREATED', language);

        return right({
            sale,
            message: successMessage,
        });
    }

    private validateSale(request: CreateSaleUseCaseRequest, language: Language): true | AppError {

      @core// if (request.items.length === 0) {
      @core//     return new AppError('errors.SALE_NO_ITEMS')
      @core//         ;
      @core// }

      @core// const calculatedTotals = this.calculateTotals(request.items);

      @core// if (Math.abs(calculatedTotals.productAmount - calculatedTotals.totalAmount) > 0.01) {
      @core//     return new SaleValidationError(
      @core//         'errors.PRODUCT_AMOUNT_MISMATCH',
      @core//         this.i18nService.translate('errors.PRODUCT_AMOUNT_MISMATCH', language),
      @core//         { expected: calculatedTotals.totalAmount, actual: calculatedTotals.productAmount }
      @core//     );
      @core// }

      @modul@core// Adicione mais validações conforme necessário, por exemplo:
      @core// if (Math.abs(calculatedTotals.commissionAmount - request.items.reduce((sum, item) => sum + item.commissionAmount, 0)) > 0.01) {
      @core//     return new SaleValidationError(
      @core//         'errors.COMMISSION_AMOUNT_MISMATCH',
      @core//         this.i18nService.translate('errors.COMMISSION_AMOUNT_MISMATCH', language),
      @core//         { expected: calculatedTotals.commissionAmount, actual: request.items.reduce((sum, item) => sum + item.commissionAmount, 0) }
      @core//     );
      @core// }

        return true;
    }

    private createSaleEntity(request: CreateSaleUseCaseRequest): Sale {
        const calculatedTotals = this.calculateTotals(request.items);

        const sale = Sale.create({
            businessId: new UniqueEntityID(request.businessId),
            customerId: request.customerId ? new UniqueEntityID(request.customerId) : undefined,
            ownerId: new UniqueEntityID(request.ownerId),
            salesPersonId: new UniqueEntityID(request.salesPersonId),
            channelId: request.channelId ? new UniqueEntityID(request.channelId) : undefined,
            issueDate: request.issueDate,
            status: request.status as SaleStatus,
            notes: request.notes,
            servicesAmount: 0@core// Assumindo que não há serviços neste exemplo
            productAmount: calculatedTotals.productAmount,
            grossAmount: calculatedTotals.productAmount,
            discountAmount: calculatedTotals.discountAmount,
            amount: calculatedTotals.totalAmount,
            commissionAmount: calculatedTotals.commissionAmount,
            shippingAmount: 0@core// Assumindo que não há frete neste exemplo
            items: [],
        });

        request.items.forEach((item) => {
            const saleItem = SaleItem.create({
                saleId: sale.id,
                itemId: new UniqueEntityID(item.itemId),
                itemDescription: item.itemDescription,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                discountAmount: item.discountAmount,
                commissionAmount: item.commissionAmount,
                totalPrice: (item.quantity * item.unitPrice) - item.discountAmount,
            });
            sale.addItem(saleItem);
        });

        return sale;
    }

    private calculateTotals(items: SaleItemRequest[]) {
        return items.reduce(
            (acc, item) => {
                const itemTotal = item.quantity * item.unitPrice - item.discountAmount;
                return {
                    productAmount: acc.productAmount + itemTotal,
                    discountAmount: acc.discountAmount + item.discountAmount,
                    commissionAmount: acc.commissionAmount + item.commissionAmount,
                    totalAmount: acc.totalAmount + itemTotal,
                };
            },
            { productAmount: 0, discountAmount: 0, commissionAmount: 0, totalAmount: 0 }
        );
    }
}