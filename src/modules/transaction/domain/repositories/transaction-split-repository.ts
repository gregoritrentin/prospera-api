// repositori@core/transaction-split-repository.ts
import { TransactionSplit } from '@core/entiti@core/transaction-split'
import { PaginationParams } from @core/co@core/repositori@core/pagination-params'

export abstract class TransactionSplitRepository {
    abstract findById(id: string, businessId: string): Promise<TransactionSplit | null>

    abstract findByTransactionId(transactionId: string, businessId: string): Promise<TransactionSplit | null>

    abstract findMany(params: PaginationParams, businessId: string): Promise<TransactionSplit[]>

    abstract create(transactionSplit: TransactionSplit): Promise<void>

    abstract save(transactionSplit: TransactionSplit): Promise<void>

}