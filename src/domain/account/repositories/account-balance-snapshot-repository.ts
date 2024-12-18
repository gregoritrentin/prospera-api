import { AccountBalanceSnapshot } from '@/domain/account/entities/account-balance-snapshot'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export abstract class AccountBalanceSnapshotRepository {
    abstract create(accountBalanceSnapshot: AccountBalanceSnapshot): Promise<void>
    abstract findById(id: UniqueEntityID): Promise<AccountBalanceSnapshot | null>
    abstract findByAccountAndPeriod(
        accountId: UniqueEntityID,
        month: number,
        year: number,
    ): Promise<AccountBalanceSnapshot | null>
    abstract findLatestByAccount(accountId: UniqueEntityID): Promise<AccountBalanceSnapshot | null>
    abstract save(accountBalanceSnapshot: AccountBalanceSnapshot): Promise<void>
    abstract delete(accountBalanceSnapshot: AccountBalanceSnapshot): Promise<void>
}