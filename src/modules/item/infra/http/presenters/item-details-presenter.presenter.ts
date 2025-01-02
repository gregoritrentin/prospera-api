import { ItemDetails } from '@/modules/item/domain/entities/value-objects/item-details'

export class ItemDetailsPresenter {
    static toHttp(itemDetails: ItemDetails) {
        return {

            businessId: itemDetails.businessId.toString(),
            businessName: itemDetails.businessName,
            itemId: itemDetails.itemId.toString(),
            description: itemDetails.description,
            idAux: itemDetails.idAux,
            itemType: itemDetails.itemType,
            price: itemDetails.price,
            unit: itemDetails.unit,
            groupId: itemDetails.groupId,
            taxationId: itemDetails.taxationId,
            ncm: itemDetails.ncm,
            status: itemDetails.status,
            createdAt: itemDetails.createdAt,
            updatedAt: itemDetails.updatedAt
        }
    }
}