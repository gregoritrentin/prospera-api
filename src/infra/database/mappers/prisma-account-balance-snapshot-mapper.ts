import { AccountBalanceSnapshot } from '@/domain/account/entities/account-balance-snapshot'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AccountBalanceSnapshot as PrismaAccountBalanceSnapshot } from '@prisma/client'

export class PrismaAccountBalanceSnapshotMapper {
    static toPrisma(accountBalanceSnapshot: AccountBalanceSnapshot) {
        return {
            id: accountBalanceSnapshot.id.toString(),
            accountId: accountBalanceSnapshot.accountId.toString(),
            balance: accountBalanceSnapshot.balance,
            month: accountBalanceSnapshot.month,
            year: accountBalanceSnapshot.year,
            snapshotTimestamp: accountBalanceSnapshot.snapshotTimestamp,
            lastTransactionId: accountBalanceSnapshot.lastTransactionId,
            lastTransactionTimestamp: accountBalanceSnapshot.lastTransactionTimestamp,
            createdAt: accountBalanceSnapshot.createdAt,
            updatedAt: accountBalanceSnapshot.updatedAt,
        }
    }

    static toDomain(raw: PrismaAccountBalanceSnapshot): AccountBalanceSnapshot {
        return AccountBalanceSnapshot.create(
            {
                accountId: new UniqueEntityID(raw.accountId),
                balance: raw.balance.toNumber(),
                month: raw.month,
                year: raw.year,
                snapshotTimestamp: raw.snapshotTimestamp,
                lastTransactionId: raw.lastTransactionId,
                lastTransactionTimestamp: raw.lastTransactionTimestamp,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new UniqueEntityID(raw.id),
        )
    }
}