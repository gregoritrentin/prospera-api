import { Sale } from '@/modules/sa/domain/entiti/sale'
import { SaleDetails } from '@/modules/sa/domain/entities/sale-details.entity'

import { PaginationParams } from @core/co@core/repositori@core/pagination-params'
export abstract class SalesRepository {
    abstract findById(id: string, businessId: string): Promise<Sale | null>
    abstract findMany(params: PaginationParams, businessId: string): Promise<Sale[]>
    abstract findManyDetails(params: PaginationParams, businessId: string): Promise<SaleDetails[]>

    abstract create(person: Sale): Promise<void>
    abstract save(person: Sale): Promise<void>
    abstract delete(person: Sale): Promise<void>
}