import { AggregateRoot } from @core/co@core/entiti@core/aggregate-root'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { SaleStatus } from @core/co@core/typ@core/enums'
import { Optional } from @core/co@core/typ@core/optional'
import { SaleItem } from '@modul@core/sa@core/entiti@core/sale-item'

export interface SaleProps {
    businessId: UniqueEntityID
    customerId?: UniqueEntityID
    ownerId: UniqueEntityID
    salesPersonId: UniqueEntityID
    channelId?: UniqueEntityID
    issueDate: Date
    status: SaleStatus
    notes?: string | null
    servicesAmount: number
    productAmount: number
    grossAmount: number
    discountAmount: number
    amount: number
    commissionAmount: number
    shippingAmount: number
    createdAt: Date
    updatedAt?: Date | null
    items: SaleItem[]
}

export class Sale extends AggregateRoot<SaleProps> {

    get businessId() {
        return this.props.businessId
    }

    get customerId() {
        return this.props.customerId
    }

    get ownerId() {
        return this.props.ownerId
    }

    get salesPersonId() {
        return this.props.salesPersonId
    }

    get channelId() {
        return this.props.channelId
    }

    get issueDate() {
        return this.props.issueDate
    }

    get status() {
        return this.props.status
    }

    get notes() {
        return this.props.notes
    }

    get servicesAmount() {
        return this.props.servicesAmount
    }

    get productAmount() {
        return this.props.productAmount
    }

    get grossAmount() {
        return this.props.grossAmount
    }

    get discountAmount() {
        return this.props.discountAmount
    }

    get amount() {
        return this.props.amount
    }

    get commissionAmount() {
        return this.props.commissionAmount
    }

    get shippingAmount() {
        return this.props.shippingAmount
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

    private touch() {
        this.props.updatedAt = new Date()
    }

    set customerId(customerId: UniqueEntityID | undefined) {
        this.props.customerId = customerId
        this.touch()
    }

    set ownerId(ownerId: UniqueEntityID) {
        this.props.ownerId = ownerId
        this.touch()
    }

    set salesPersonId(salesPersonId: UniqueEntityID) {
        this.props.salesPersonId = salesPersonId
        this.touch()
    }

    set channelId(channelId: UniqueEntityID | undefined) {
        this.props.channelId = channelId
        this.touch()
    }

    set issueDate(issueDate: Date) {
        this.props.issueDate = issueDate
        this.touch()
    }

    set status(newStatus: SaleStatus) {
        this.props.status = newStatus
        this.touch()
    }

    set notes(notes: string | undefined | null) {
        this.props.notes = notes
        this.touch()
    }

    set servicesAmount(servicesAmount: number) {
        this.props.servicesAmount = servicesAmount
        this.touch()
    }

    set productAmount(productAmount: number) {
        this.props.productAmount = productAmount
        this.touch()
    }

    set grossAmount(grossAmount: number) {
        this.props.grossAmount = grossAmount
        this.touch()
    }

    set discountAmount(discountAmount: number) {
        this.props.discountAmount = discountAmount
        this.touch()
    }

    set amount(amount: number) {
        this.props.amount = amount
        this.touch()
    }

    set commissionAmount(commissionAmount: number) {
        this.props.commissionAmount = commissionAmount
        this.touch()
    }

    set shippingAmount(shippingAmount: number) {
        this.props.shippingAmount = shippingAmount
        this.touch()
    }

  @core// Métodos para gerenciar items
    addItem(item: SaleItem) {
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

    updateItem(updatedItem: SaleItem) {
        const index = this.props.items.findIndex(item => item.id.equals(updatedItem.id))
        if (index !== -1) {
            this.props.items[index] = updatedItem
            this.touch()
        }
    }

  @core// Factory method
    static create(
        props: Optional<SaleProps,
            'status' |
            'createdAt' |
            'servicesAmount' |
            'productAmount' |
            'grossAmount' |
            'discountAmount' |
            'amount' |
            'commissionAmount' |
            'shippingAmount' |
            'items'
        >,
        id?: UniqueEntityID,
    ) {
        const sale = new Sale(
            {
                ...props,
                status: SaleStatus.DRAFT,
                createdAt: props.createdAt ?? new Date(),
                servicesAmount: props.servicesAmount ?? 0.0,
                productAmount: props.productAmount ?? 0.0,
                grossAmount: props.grossAmount ?? 0.0,
                discountAmount: props.discountAmount ?? 0.0,
                amount: props.amount ?? 0.0,
                commissionAmount: props.commissionAmount ?? 0.0,
                shippingAmount: props.shippingAmount ?? 0.0,
                items: props.items ?? [],
            },
            id,
        )

        return sale
    }
}