import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface InvoiceItemProps {
    invoiceId: UniqueEntityID
    itemId: UniqueEntityID
    itemDescription: string
    quantity: number
    unitPrice: number
    discount: number
    totalPrice: number
}

export class InvoiceItem extends Entity<InvoiceItemProps> {
    get invoiceId() {
        return this.props.invoiceId
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

    get discount() {
        return this.props.discount
    }

    get totalPrice() {
        return this.props.totalPrice
    }

    static create(props: InvoiceItemProps, id?: UniqueEntityID) {
        const invoiceItem = new InvoiceItem(props, id)

        return invoiceItem
    }
}