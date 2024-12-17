import { PaginationParams } from '@/core/repositories/pagination-params'
import { Account } from '../entities/account'

export abstract class AccountsRepository {
    abstract findById(id: string, businessId: string): Promise<Account | null>
    abstract findMany(params: PaginationParams): Promise<Account[]>
    abstract create(account: Account): Promise<void>
}