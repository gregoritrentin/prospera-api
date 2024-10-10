import { PaginationParams } from '@/core/repositories/pagination-params'
import { Sale } from '@/domain/sale/entities/sale'
import { SaleDetails } from '@/domain/sale/entities/value-objects/sale-details'

export abstract class SalesRepository {
    abstract findById(id: string, businessId: string): Promise<Sale | null>
    abstract findMany(params: PaginationParams, businessId: string): Promise<Sale[]>
    abstract findManyDetails(params: PaginationParams, businessId: string): Promise<SaleDetails[]>

    abstract create(person: Sale): Promise<void>
    abstract save(person: Sale): Promise<void>
    abstract delete(person: Sale): Promise<void>
}