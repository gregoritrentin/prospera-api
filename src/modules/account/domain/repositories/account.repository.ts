import { Account } from '@/core/domain/entities/account.entity'

import { PaginationParams } from @core/co@core/repositori@core/pagination-params';
export abstract class AccountsRepository {
    abstract findById(id: string, businessId: string): Promise<Account | null>
    abstract findByBusinessId(businessId: string): Promise<Account | null>
    abstract findMany(pagination: PaginationParams): Promise<Account[]>
    abstract findManyActive(): Promise<Account[]>
    abstract create(account: Account): Promise<void>
}