import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AccountProps {
    businessId: UniqueEntityID
    number: string
    status: string
    createdAt: Date
    updatedAt?: Date | null
}

export class Account extends AggregateRoot<AccountProps> {
    get businessId() {
        return this.props.businessId
    }

    get number() {
        return this.props.number
    }

    get status() {
        return this.props.status
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

    set number(number: string) {
        this.props.number = number
        this.touch()
    }

    set status(status: string) {
        this.props.status = status
        this.touch()
    }

    static create(
        props: Optional<AccountProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const account = new Account(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )

        return account
    }
}