import { Item } from '@/modules/it/domain/entiti/item'
import { ItemDetails } from '@/modules/it/domain/entities/item-details.entity'

import { PaginationParams } from @core/co@core/repositori@core/pagination-params'
export abstract class ItemRepository {
    abstract findById(id: string, businessId: string): Promise<Item | null>
    abstract findMany(params: PaginationParams, businessId: string): Promise<Item[]>
    abstract findManyDetails(params: PaginationParams, businessId: string): Promise<ItemDetails[]>

    abstract create(item: Item): Promise<void>
    abstract save(item: Item): Promise<void>
    abstract delete(item: Item): Promise<void>
}