import { Sale } from "@/domain/sale/entities/sale";
import { SaleItemPresenter } from "@/infra/http/presenters/sale-item-presenter";

export class SalePresenter {
    static toHttp(sale: Sale) {
        return {
            businessId: sale.businessId.toString(),
            customerId: sale.customerId ? sale.customerId.toString() : null,
            //customerName: sale.customerName,
            ownerId: sale.ownerId.toString(),
            //ownerName: sale.ownerName,
            salesPersonId: sale.salesPersonId.toString(),
            //salesPersonName: sale.salesPersonName,
            channelId: sale.channelId ? sale.channelId.toString() : null,
            //channelName: sale.channelName,
            issueDate: sale.issueDate,
            status: sale.status,
            notes: sale.notes,
            servicesAmount: sale.servicesAmount,
            productAmount: sale.productAmount,
            grossAmount: sale.grossAmount,
            discountAmount: sale.discountAmount,
            amount: sale.amount,
            commissionAmount: sale.commissionAmount,
            shippingAmount: sale.shippingAmount,
            createdAt: sale.createdAt,
            updatedAt: sale.updatedAt,
            items: sale.items.map(SaleItemPresenter.toHttp)
        };
    }
}