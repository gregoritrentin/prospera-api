import { Item } from "@/modules/item/domain/entities/item"

export class ItemPresenter {
    static toHttp(item: Item) {
        return {
            id: item.id.toString(),
            businessId: item.businessId.toString(),
            description: item.description,
            idAux: item.idAux,
            itemType: item.itemType,
            status: item.status,
            unit: item.unit,
            price: item.price,
            groupId: item.groupId,
            taxationId: item.taxationId,
            ncm: item.ncm,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }
    }
}