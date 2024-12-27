import { AggregateRoot } from @core/co@core/entiti@core/aggregate-root'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { ReceivableStatus } from @core/co@core/typ@core/enums';
import { Optional } from @core/co@core/typ@core/optional'

export interface ReceivableProps {
    transactionId: UniqueEntityID;
    originalOwnerId: UniqueEntityID;
    currentOwnerId: UniqueEntityID;
    amount: number;
    netAmount: number;
    originalDueDate: Date;
    currentDueDate: Date;
    status: ReceivableStatus;
    businessId?: UniqueEntityID;
    createdAt: Date;
    updatedAt?: Date | null;
}

export class Receivable extends AggregateRoot<ReceivableProps> {
    get transactionId() {
        return this.props.transactionId
    }

    get originalOwnerId() {
        return this.props.originalOwnerId
    }

    get currentOwnerId() {
        return this.props.currentOwnerId
    }

    get amount() {
        return this.props.amount
    }

    get netAmount() {
        return this.props.netAmount
    }

    get originalDueDate() {
        return this.props.originalDueDate
    }

    get currentDueDate() {
        return this.props.currentDueDate
    }

    get status() {
        return this.props.status
    }

    get businessId() {
        return this.props.businessId
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

    set transactionId(transactionId: UniqueEntityID) {
        this.props.transactionId = transactionId
        this.touch()
    }

    set originalOwnerId(originalOwnerId: UniqueEntityID) {
        this.props.originalOwnerId = originalOwnerId
        this.touch()
    }

    set currentOwnerId(currentOwnerId: UniqueEntityID) {
        this.props.currentOwnerId = currentOwnerId
        this.touch()
    }

    set amount(amount: number) {
        this.props.amount = amount
        this.touch()
    }

    set netAmount(netAmount: number) {
        this.props.netAmount = netAmount
        this.touch()
    }

    set originalDueDate(originalDueDate: Date) {
        this.props.originalDueDate = originalDueDate
        this.touch()
    }

    set currentDueDate(currentDueDate: Date) {
        this.props.currentDueDate = currentDueDate
        this.touch()
    }

    set status(status: ReceivableStatus) {
        this.props.status = status
        this.touch()
    }

    set businessId(businessId: UniqueEntityID | undefined) {
        this.props.businessId = businessId
        this.touch()
    }

    static create(
        props: Optional<ReceivableProps, 'createdAt' | 'updatedAt'>,
        id?: UniqueEntityID,
    ) {
        const receivable = new Receivable(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
                updatedAt: props.updatedAt ?? null,
            },
            id,
        )

        return receivable
    }
}