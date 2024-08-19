import { PaginationParams } from '@/core/repositories/pagination-params'
import { Item } from '@/domain/item/entities/item'
import { ItemDetails } from '@/domain/item/entities/value-objects/item-details'


export abstract class ItemRepository {
    abstract findById(id: string, businessId: string): Promise<Item | null>
    abstract findMany(params: PaginationParams, businessId: string): Promise<Item[]>
    abstract findManyDetails(params: PaginationParams, businessId: string): Promise<ItemDetails[]>

    abstract create(item: Item): Promise<void>
    abstract save(item: Item): Promise<void>
    abstract delete(item: Item): Promise<void>
}
