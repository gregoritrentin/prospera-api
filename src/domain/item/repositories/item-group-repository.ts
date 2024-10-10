import { PaginationParams } from '@/core/repositories/pagination-params'
import { ItemGroup } from '@/domain/item/entities/item-group'

export abstract class ItemGroupRepository {
    abstract findById(id: string, businessId: string): Promise<ItemGroup | null>
    abstract findMany(params: PaginationParams, businessId: string): Promise<ItemGroup[]>

    abstract create(itemGroup: ItemGroup): Promise<void>
    abstract save(itemGroup: ItemGroup): Promise<void>
    abstract delete(itemGroup: ItemGroup): Promise<void>
}
