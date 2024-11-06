import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface SubscriptionItemProps {
    subscriptionId: UniqueEntityID
    itemId: UniqueEntityID
    itemDescription: string
    quantity: number
    unitPrice: number
    totalPrice: number
    status: string
    createdAt: Date
    updatedAt?: Date | null
}

export class SubscriptionItem extends Entity<SubscriptionItemProps> {
    get subscriptionId() {
        return this.props.subscriptionId
    }

    get itemId() {
        return this.props.itemId
    }

    get itemDescription() {
        return this.props.itemDescription
    }

    get quantity() {
        return this.props.quantity
    }

    get unitPrice() {
        return this.props.unitPrice
    }

    get totalPrice() {
        return this.props.totalPrice
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

    set status(status: string) {
        this.props.status = status
        this.touch()
    }

    static create(props: SubscriptionItemProps, id?: UniqueEntityID) {
        const subscriptionItem = new SubscriptionItem(props, id)
        return subscriptionItem
    }
}