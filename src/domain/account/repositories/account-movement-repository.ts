import { PaginationParams } from '@/core/repositories/pagination-params'
import { AccountMovement } from '../entities/account-movement'

export abstract class AccountMovementsRepository {
    abstract findById(id: string): Promise<AccountMovement | null>
    abstract findMany(
        params: PaginationParams,
        accountId: string
    ): Promise<AccountMovement[]>
    abstract create(accountMovement: AccountMovement): Promise<void>
}