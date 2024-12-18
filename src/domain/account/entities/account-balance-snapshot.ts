import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AccountBalanceSnapshotProps {
    accountId: UniqueEntityID
    balance: number
    month: number
    year: number
    snapshotTimestamp: Date
    lastTransactionId: string
    lastTransactionTimestamp: Date
    createdAt: Date
    updatedAt?: Date | null
}

export class AccountBalanceSnapshot extends AggregateRoot<AccountBalanceSnapshotProps> {
    get accountId() {
        return this.props.accountId
    }

    get balance() {
        return this.props.balance
    }

    get month() {
        return this.props.month
    }

    get year() {
        return this.props.year
    }

    get snapshotTimestamp() {
        return this.props.snapshotTimestamp
    }

    get lastTransactionId() {
        return this.props.lastTransactionId
    }

    get lastTransactionTimestamp() {
        return this.props.lastTransactionTimestamp
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

    set balance(balance: number) {
        this.props.balance = balance
        this.touch()
    }

    set lastTransactionId(transactionId: string) {
        this.props.lastTransactionId = transactionId
        this.touch()
    }

    set lastTransactionTimestamp(timestamp: Date) {
        this.props.lastTransactionTimestamp = timestamp
        this.touch()
    }

    set snapshotTimestamp(timestamp: Date) {
        this.props.snapshotTimestamp = timestamp
        this.touch()
    }

    static create(
        props: Optional<AccountBalanceSnapshotProps, 'createdAt' | 'updatedAt' | 'snapshotTimestamp'>,
        id?: UniqueEntityID,
    ) {
        const accountBalanceSnapshot = new AccountBalanceSnapshot(
            {
                ...props,
                snapshotTimestamp: props.snapshotTimestamp ?? new Date(),
                createdAt: props.createdAt ?? new Date(),
                updatedAt: props.updatedAt ?? null,
            },
            id,
        )

        return accountBalanceSnapshot
    }
}