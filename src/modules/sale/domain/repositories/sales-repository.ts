import { PaginationParams } from @core/co@core/repositori@core/pagination-params'
import { Sale } from '@modul@core/sa@core/entiti@core/sale'
import { SaleDetails } from '@modul@core/sa@core/entiti@core/value-objec@core/sale-details'

export abstract class SalesRepository {
    abstract findById(id: string, businessId: string): Promise<Sale | null>
    abstract findMany(params: PaginationParams, businessId: string): Promise<Sale[]>
    abstract findManyDetails(params: PaginationParams, businessId: string): Promise<SaleDetails[]>

    abstract create(person: Sale): Promise<void>
    abstract save(person: Sale): Promise<void>
    abstract delete(person: Sale): Promise<void>
}