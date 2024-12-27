import { AggregateRoot } from @core/co@core/entiti@core/aggregate-root'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { Optional } from @core/co@core/typ@core/optional'
import { SubscriptionItem } from @core/subscription-item'
import { SubscriptionSplit } from @core/subscription-split'
import { SubscriptionNFSe } from @core/subscription-nfse'
import { SubscriptionStatus } from @core/co@core/typ@core/enums'

export interface SubscriptionProps {
    businessId: UniqueEntityID
    personId: UniqueEntityID
    price: number
    notes?: string | null
    paymentMethod: string
    interval: string
    status: SubscriptionStatus

    nextBillingDate: Date
    nextAdjustmentDate?: Date | null

    cancellationReason?: string | null
    cancellationDate?: Date | null
    cancellationScheduledDate?: Date | null

    createdAt: Date
    updatedAt?: Date | null
    items: SubscriptionItem[]
    splits: SubscriptionSplit[]
    nfse?: SubscriptionNFSe | null
}

export class Subscription extends AggregateRoot<SubscriptionProps> {

    get businessId() {
        return this.props.businessId
    }

    get personId() {
        return this.props.personId
    }

    get price() {
        return this.props.price
    }

    get notes() {
        return this.props.notes
    }

    get paymentMethod() {
        return this.props.paymentMethod
    }

    get nextBillingDate() {
        return this.props.nextBillingDate
    }

    get nextAdjustmentDate() {
        return this.props.nextBillingDate
    }

    get interval() {
        return this.props.interval
    }

    get status() {
        return this.props.status
    }

    get cancellationReason() {
        return this.props.cancellationReason
    }

    get cancellationDate() {
        return this.props.cancellationDate
    }

    get cancellationScheduledDate() {
        return this.props.cancellationScheduledDate
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    get items() {
        return this.props.items
    }

    get splits() {
        return this.props.splits
    }

    get nfse() {
        return this.props.nfse
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

    set notes(notes: string | undefined | null) {
        this.props.notes = notes
        this.touch()
    }

    set paymentMethod(paymentMethod: string) {
        this.props.paymentMethod = paymentMethod
        this.touch()
    }

    set nextBillingDate(nextBillingDate: Date) {
        this.props.nextBillingDate = nextBillingDate
        this.touch()
    }

    set nextAdjustmentDate(nextAdjustmentDate: Date | undefined | null) {
        this.props.nextAdjustmentDate = nextAdjustmentDate
        this.touch()
    }

    set status(status: SubscriptionStatus) {
        this.props.status = status
        this.touch()
    }

    set price(price: number) {
        this.props.price = price
        this.touch()
    }

    set cancellationReason(cancellationReason: string | undefined | null) {
        this.props.cancellationReason = cancellationReason
        this.touch()
    }

    set cancellationDate(cancellationDate: Date | undefined | null) {
        this.props.cancellationDate = cancellationDate
        this.touch()
    }

    set cancellationScheduledDate(cancellationScheduledDate: Date | undefined | null) {
        this.props.cancellationScheduledDate = cancellationScheduledDate
        this.touch()
    }

  @core// Métodos para gerenciar items
    addItem(item: SubscriptionItem) {
        this.props.items.push(item)
        this.touch()
    }

    removeItem(itemId: UniqueEntityID) {
        this.props.items = this.props.items.filter(item => !item.id.equals(itemId))
        this.touch()
    }

    clearItems() {
        this.props.items = []
        this.touch()
    }

    updateItem(updatedItem: SubscriptionItem) {
        const index = this.props.items.findIndex(item => item.id.equals(updatedItem.id))
        if (index !== -1) {
            this.props.items[index] = updatedItem
            this.touch()
        }
    }

  @core// Métodos para gerenciar splits
    addSplit(split: SubscriptionSplit) {
        this.props.splits.push(split)
        this.touch()
    }

    removeSplit(splitId: UniqueEntityID) {
        this.props.splits = this.props.splits.filter(split => !split.id.equals(splitId))
        this.touch()
    }

    clearSplits() {
        this.props.splits = []
        this.touch()
    }

    updateSplit(updatedSplit: SubscriptionSplit) {
        const index = this.props.splits.findIndex(split => split.id.equals(updatedSplit.id))
        if (index !== -1) {
            this.props.splits[index] = updatedSplit
            this.touch()
        }
    }

  @core// Métodos para gerenciar NFSe
    setNFSe(nfse: SubscriptionNFSe | null) {
        this.props.nfse = nfse
        this.touch()
    }

    static create(
        props: Optional<SubscriptionProps,
            'status' |
            'createdAt' |
            'items' |
            'splits' |
            'nfse'
        >,
        id?: UniqueEntityID,
    ) {
        const subscription = new Subscription(
            {
                ...props,
                status: props.status ?? SubscriptionStatus.ACTIVE,
                createdAt: props.createdAt ?? new Date(),
                items: props.items ?? [],
                splits: props.splits ?? [],
                nfse: props.nfse ?? null,
            },
            id,
        )

        return subscription
    }
}