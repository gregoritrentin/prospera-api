// repositories/transaction-split-repository.ts
import { TransactionSplit } from '../entities/transaction-split'
import { PaginationParams } from '@/core/repositories/pagination-params'

export abstract class TransactionSplitRepository {
    abstract findById(id: string, businessId: string): Promise<TransactionSplit | null>

    abstract findByTransactionId(transactionId: string, businessId: string): Promise<TransactionSplit | null>

    abstract findMany(params: PaginationParams, businessId: string): Promise<TransactionSplit[]>

    abstract create(transactionSplit: TransactionSplit): Promise<void>

    abstract save(transactionSplit: TransactionSplit): Promise<void>

}