import { AggregateRoot } from @core/co@core/entiti@core/aggregate-root'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { MovementType } from @core/co@core/typ@core/enums'
import { Optional } from @core/co@core/typ@core/optional'
export interface AccountMovementProps {
    accountId: UniqueEntityID
    type: MovementType
    amount: number
    description?: string | null
    createdAt: Date
    updatedAt?: Date | null
}

export class AccountMovement extends AggregateRoot<AccountMovementProps> {
    get accountId() {
        return this.props.accountId
    }

    get type() {
        return this.props.type
    }

    get amount() {
        return this.props.amount
    }

    get description() {
        return this.props.description
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

    set type(type: MovementType) {
        this.props.type = type
        this.touch()
    }

    set amount(amount: number) {
        this.props.amount = amount
        this.touch()
    }

    set description(description: string | undefined | null) {
        if (description === undefined && description === null) {
            return
        }
        this.props.description = description
        this.touch()
    }

    static create(
        props: Optional<AccountMovementProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const accountMovement = new AccountMovement(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )

        return accountMovement
    }
}

export { MovementType }
