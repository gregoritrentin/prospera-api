import { Entity } from @core/co@core/entiti@core/entity'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'

export interface SaleItemProps {
    saleId: UniqueEntityID
    itemId: UniqueEntityID
    itemDescription: string
    quantity: number
    unitPrice: number
    discountAmount: number
    commissionAmount: number
    totalPrice: number
}

export class SaleItem extends Entity<SaleItemProps> {
    get saleId() {
        return this.props.saleId
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

    get discountAmount() {
        return this.props.discountAmount
    }

    get commissionAmount() {
        return this.props.commissionAmount
    }

    get totalPrice() {
        return this.props.totalPrice
    }

    static create(props: SaleItemProps, id?: UniqueEntityID) {
        const saleItem = new SaleItem(props, id)

        return saleItem
    }
}