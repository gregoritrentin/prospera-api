import { PaginationParams } from @core/co@core/repositori@core/pagination-params'
import { ItemTaxation } from '@modul@core/it@core/entiti@core/item-taxation'

export abstract class ItemTaxationRepository {
    abstract findById(id: string, businessId: string): Promise<ItemTaxation | null>
    abstract findMany(params: PaginationParams, businessId: string): Promise<ItemTaxation[]>

    abstract create(itemTaxation: ItemTaxation): Promise<void>
    abstract save(itemTaxation: ItemTaxation): Promise<void>
    abstract delete(itemTaxation: ItemTaxation): Promise<void>
}
