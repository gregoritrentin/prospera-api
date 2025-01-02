import { Transaction } from '@/modules/transacti/domain/entiti/transaction'
import { TransactionDetails } from '@/modules/transacti/domain/entities/transaction-details.entity'

import { PaginationParams } from @core/co@core/repositori@core/pagination-params'
export abstract class TransactionRepository {

    abstract findById(id: string, businessId: string): Promise<Transaction | null>
    abstract findByIdDetails(id: string, businessId: string): Promise<TransactionDetails | null>

    abstract findMany(params: PaginationParams, businessId: string): Promise<Transaction[]>
    abstract findManyDetails(params: PaginationParams, businessId: string): Promise<TransactionDetails[]>

    abstract create(boleto: Transaction): Promise<void>
    abstract save(boleto: Transaction): Promise<void>

}