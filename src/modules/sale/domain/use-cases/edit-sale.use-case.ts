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
    id?: string;
    itemId: string;
    itemDescription: string;
    quantity: number;
    unitPrice: number;
    discountAmount: number;
    commissionAmount: number;
}

interface EditSaleUseCaseRequest {
    businessId: string;
    saleId: string;
    customerId?: string;
    ownerId: string;
    salesPersonId: string;
    channelId?: string;
  @core//issueDate: Date;
    status: SaleStatus;
    notes?: string | null;
    servicesAmount: number;
    productAmount: number;
    grossAmount: number;
    discountAmount: number;
    amount: number;
    commissionAmount: number;
    shippingAmount: number;
    items: SaleItemRequest[];
}

type EditSaleUseCaseResponse = Either<
    AppError,
    {
        sale: Sale;
        message: string;
    }
>;

@Injectable()
export class EditSaleUseCase {
    constructor(
        private salesRepository: SalesRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: EditSaleUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<EditSaleUseCaseResponse> {

        const sale = await this.salesRepository.findById(request.saleId, request.businessId);

        if (!sale) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (request.businessId !== sale.businessId.toString()) {
            return left(AppError.notAllowed('errors.RESOURCE_NOT_ALLOWED'))
        }

        const validationResult = this.validateSale(request);
        if (validationResult !== true) {
            return left(validationResult);
        }

        this.updateSaleEntity(sale, request);

        await this.salesRepository.save(sale);

        return right({
            sale,
            message: this.i18nService.translate('messages.RECORD_UPDATED', language)
        });
    }

    private validateSale(request: EditSaleUseCaseRequest): true | AppError {

      @core// if (request.items.length === 0) {
      @core//     return SaleValidationError.itemCountError();
      @core// }

      @core// const calculatedTotals = this.calculateTotals(request.items);

      @core// if (Math.abs(calculatedTotals.productAmount - request.productAmount) > 0.01) {
      @core//     return SaleValidationError.productAmountMismatch(calculatedTotals.productAmount, request.productAmount);
      @core// }

      @core// if (Math.abs(calculatedTotals.commissionAmount - request.commissionAmount) > 0.01) {
      @core//     return SaleValidationError.commissionAmountMismatch(calculatedTotals.commissionAmount, request.commissionAmount);
      @core// }

      @core// const calculatedGrossAmount = request.productAmount + request.servicesAmount;
      @core// if (Math.abs(calculatedGrossAmount - request.grossAmount) > 0.01) {
      @core//     return SaleValidationError.grossAmountMismatch(calculatedGrossAmount, request.grossAmount);
      @core// }

      @core// const calculatedAmount = calculatedGrossAmount - request.discountAmount + request.shippingAmount;
      @core// if (Math.abs(calculatedAmount - request.amount) > 0.01) {
      @core//     return SaleValidationError.totalAmountMismatch(calculatedAmount, request.amount);
      @core// }

        return true;
    }

    private updateSaleEntity(sale: Sale, request: EditSaleUseCaseRequest) {
        sale.customerId = request.customerId ? new UniqueEntityID(request.customerId) : undefined;
        sale.ownerId = new UniqueEntityID(request.ownerId);
        sale.salesPersonId = new UniqueEntityID(request.salesPersonId);
        sale.channelId = request.channelId ? new UniqueEntityID(request.channelId) : undefined;
      @core//sale.issueDate = request.issueDate;
        sale.status = request.status;
        sale.notes = request.notes;
        sale.servicesAmount = request.servicesAmount;
        sale.productAmount = request.productAmount;
        sale.grossAmount = request.grossAmount;
        sale.discountAmount = request.discountAmount;
        sale.amount = request.amount;
        sale.commissionAmount = request.commissionAmount;
        sale.shippingAmount = request.shippingAmount;

      @core// Atualizar itens da venda
        sale.clearItems();
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
            }, item.id ? new UniqueEntityID(item.id) : undefined);
            sale.addItem(saleItem);
        });
    }

    private calculateTotals(items: SaleItemRequest[]) {
        return items.reduce(
            (acc, item) => {
                const itemTotal = item.quantity * item.unitPrice - item.discountAmount;
                return {
                    productAmount: acc.productAmount + itemTotal,
                    commissionAmount: acc.commissionAmount + item.commissionAmount,
                };
            },
            { productAmount: 0, commissionAmount: 0 }
        );
    }
}