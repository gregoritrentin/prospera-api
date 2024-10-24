import { PaginationParams } from '@/core/repositories/pagination-params'
import { Transaction } from '@/domain/transaction/entities/transaction'
import { TransactionDetails } from '@/domain/transaction/entities/value-objects/transaction-details'

export abstract class TransactionRepository {

    abstract findById(id: string, businessId: string): Promise<Transaction | null>
    abstract findByIdDetails(id: string, businessId: string): Promise<TransactionDetails | null>

    abstract findMany(params: PaginationParams, businessId: string): Promise<Transaction[]>
    abstract findManyDetails(params: PaginationParams, businessId: string): Promise<TransactionDetails[]>

    abstract create(boleto: Transaction): Promise<void>
    abstract save(boleto: Transaction): Promise<void>

}
