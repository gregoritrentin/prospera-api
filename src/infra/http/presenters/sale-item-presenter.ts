import { SaleItemProps } from "@/domain/sale/entities/sale-item";

export class SaleItemPresenter {
    static toHttp(item: SaleItemProps) {
        return {
            saleId: item.saleId.toString(),
            itemId: item.itemId.toString(),
            itemDescription: item.itemDescription,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discountAmount: item.discountAmount,
            commissionAmount: item.commissionAmount,
            totalPrice: item.totalPrice
        };
    }
}