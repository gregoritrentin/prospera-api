import { AccountMovement } from '@/core/domain/entities/account-movement.entity'

import { PaginationParams } from @core/co@core/repositori@core/pagination-params'
export abstract class AccountMovementsRepository {
    abstract findById(id: string): Promise<AccountMovement | null>
    abstract findMany(
        params: PaginationParams,
        accountId: string
    ): Promise<AccountMovement[]>
    abstract findManyByAccountId(
        accountId: string,
        orderBy?: 'asc' | 'desc'
    ): Promise<AccountMovement[]>
    abstract create(accountMovement: AccountMovement): Promise<void>
}