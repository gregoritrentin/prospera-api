import { Entity } from @core/co@core/entiti@core/entity'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { SplitType } from @core/co@core/typ@core/enums'

export interface SubscriptionSplitProps {
    subscriptionId: UniqueEntityID
    recipientId: UniqueEntityID
    splitType: SplitType
    amount: number
    feeAmount: number
}

export class SubscriptionSplit extends Entity<SubscriptionSplitProps> {
    get subscriptionId() {
        return this.props.subscriptionId
    }

    get recipientId() {
        return this.props.recipientId
    }

    get splitType() {
        return this.props.splitType
    }

    get amount() {
        return this.props.amount
    }

    get feeAmount() {
        return this.props.feeAmount
    }

    static create(props: SubscriptionSplitProps, id?: UniqueEntityID) {
        const subscriptionSplit = new SubscriptionSplit(props, id)
        return subscriptionSplit
    }
}