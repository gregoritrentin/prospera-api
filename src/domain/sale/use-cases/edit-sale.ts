import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { Sale } from '@/domain/sale/entities/sale';
import { SaleItem } from '@/domain/sale/entities/sale-item';
import { SalesRepository } from '@/domain/sale/repositories/sales-repository';
import { I18nService, Language } from '@/i18n/i18n.service';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AppError } from '@/core/errors/app-errors';
import { SaleStatus } from '@/core/types/enums';

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
    //issueDate: Date;
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

        // if (request.items.length === 0) {
        //     return SaleValidationError.itemCountError();
        // }

        // const calculatedTotals = this.calculateTotals(request.items);

        // if (Math.abs(calculatedTotals.productAmount - request.productAmount) > 0.01) {
        //     return SaleValidationError.productAmountMismatch(calculatedTotals.productAmount, request.productAmount);
        // }

        // if (Math.abs(calculatedTotals.commissionAmount - request.commissionAmount) > 0.01) {
        //     return SaleValidationError.commissionAmountMismatch(calculatedTotals.commissionAmount, request.commissionAmount);
        // }

        // const calculatedGrossAmount = request.productAmount + request.servicesAmount;
        // if (Math.abs(calculatedGrossAmount - request.grossAmount) > 0.01) {
        //     return SaleValidationError.grossAmountMismatch(calculatedGrossAmount, request.grossAmount);
        // }

        // const calculatedAmount = calculatedGrossAmount - request.discountAmount + request.shippingAmount;
        // if (Math.abs(calculatedAmount - request.amount) > 0.01) {
        //     return SaleValidationError.totalAmountMismatch(calculatedAmount, request.amount);
        // }

        return true;
    }

    private updateSaleEntity(sale: Sale, request: EditSaleUseCaseRequest) {
        sale.customerId = request.customerId ? new UniqueEntityID(request.customerId) : undefined;
        sale.ownerId = new UniqueEntityID(request.ownerId);
        sale.salesPersonId = new UniqueEntityID(request.salesPersonId);
        sale.channelId = request.channelId ? new UniqueEntityID(request.channelId) : undefined;
        //sale.issueDate = request.issueDate;
        sale.status = request.status;
        sale.notes = request.notes;
        sale.servicesAmount = request.servicesAmount;
        sale.productAmount = request.productAmount;
        sale.grossAmount = request.grossAmount;
        sale.discountAmount = request.discountAmount;
        sale.amount = request.amount;
        sale.commissionAmount = request.commissionAmount;
        sale.shippingAmount = request.shippingAmount;

        // Atualizar itens da venda
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