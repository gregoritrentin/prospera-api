import { ItemTaxation } from '@/modules/it/domain/entiti/item-taxation'

import { PaginationParams } from @core/co@core/repositori@core/pagination-params'
export abstract class ItemTaxationRepository {
    abstract findById(id: string, businessId: string): Promise<ItemTaxation | null>
    abstract findMany(params: PaginationParams, businessId: string): Promise<ItemTaxation[]>

    abstract create(itemTaxation: ItemTaxation): Promise<void>
    abstract save(itemTaxation: ItemTaxation): Promise<void>
    abstract delete(itemTaxation: ItemTaxation): Promise<void>
}