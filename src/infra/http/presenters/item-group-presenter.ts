import { ItemGroup } from '@/domain/item/entities/item-group'

export class ItemGroupPresenter {
    static toHttp(itemGroup: ItemGroup) {
        return {
            id: itemGroup.id.toString(),
            group: itemGroup.group,
            status: itemGroup.status,
            createdAt: itemGroup.createdAt,
            updatedAt: itemGroup.updatedAt,

        }
    }
}