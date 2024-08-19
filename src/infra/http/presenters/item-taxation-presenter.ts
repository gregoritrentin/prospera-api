import { ItemTaxation } from '@/domain/item/entities/item-taxation'

export class ItemTaxationPresenter {
    static toHttp(itemTaxation: ItemTaxation) {
        return {
            id: itemTaxation.id.toString(),
            taxation: itemTaxation.taxation,
            status: itemTaxation.status,
            createdAt: itemTaxation.createdAt,
            updatedAt: itemTaxation.updatedAt,

        }
    }
}