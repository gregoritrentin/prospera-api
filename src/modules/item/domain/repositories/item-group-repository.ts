import { PaginationParams } from @core/co@core/repositori@core/pagination-params'
import { ItemGroup } from '@modul@core/it@core/entiti@core/item-group'

export abstract class ItemGroupRepository {
    abstract findById(id: string, businessId: string): Promise<ItemGroup | null>
    abstract findMany(params: PaginationParams, businessId: string): Promise<ItemGroup[]>

    abstract create(itemGroup: ItemGroup): Promise<void>
    abstract save(itemGroup: ItemGroup): Promise<void>
    abstract delete(itemGroup: ItemGroup): Promise<void>
}
