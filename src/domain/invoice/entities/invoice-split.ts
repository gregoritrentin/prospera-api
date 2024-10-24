import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export enum CalculationMode {
    NONE = 'NONE',
    PERCENT = 'PERCENT',
    VALUE = 'VALUE'
}

export interface InvoiceSplitProps {
    invoiceId: UniqueEntityID
    recipientId: UniqueEntityID
    splitType: CalculationMode
    amount: number
    feeAmount: number
}

export class InvoiceSplit extends Entity<InvoiceSplitProps> {
    get invoiceId() {
        return this.props.invoiceId
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

    static create(props: InvoiceSplitProps, id?: UniqueEntityID) {
        const invoiceSplit = new InvoiceSplit(props, id)

        return invoiceSplit
    }
}