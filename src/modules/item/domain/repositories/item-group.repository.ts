import { ItemGroup } from '@/modules/it/domain/entiti/item-group'

import { PaginationParams } from @core/co@core/repositori@core/pagination-params'
export abstract class ItemGroupRepository {
    abstract findById(id: string, businessId: string): Promise<ItemGroup | null>
    abstract findMany(params: PaginationParams, businessId: string): Promise<ItemGroup[]>

    abstract create(itemGroup: ItemGroup): Promise<void>
    abstract save(itemGroup: ItemGroup): Promise<void>
    abstract delete(itemGroup: ItemGroup): Promise<void>
}