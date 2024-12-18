import { Receivable } from '../entities/receivable'
import { PaginationParams } from '@/core/repositories/pagination-params'
//import { ReceivableDetails } from '../entities/value-objects/receivable-details'

export abstract class ReceivableRepository {
    abstract findById(id: string, businessId: string): Promise<Receivable | null>

    abstract findByTransactionId(transactionId: string, businessId: string): Promise<Receivable | null>

    abstract findMany(params: PaginationParams, businessId: string): Promise<Receivable[]>

    //abstract findManyDetails(params: PaginationParams, businessId: string): Promise<ReceivableDetails[]>

    abstract save(receivable: Receivable): Promise<void>

    abstract create(receivable: Receivable): Promise<void>

    //abstract delete(receivable: Receivable): Promise<void>
}