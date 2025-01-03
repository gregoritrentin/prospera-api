import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PaymentMethod } from '@/core/types/enums'

export interface InvoicePaymentProps {
    invoiceId: UniqueEntityID
    dueDate: Date
    amount: number
    paymentMethod: PaymentMethod

}

export class InvoicePayment extends Entity<InvoicePaymentProps> {
    get invoiceId() {
        return this.props.invoiceId
    }

    get dueDate() {
        return this.props.dueDate
    }

    get amount() {
        return this.props.amount
    }

    get paymentMethod() {
        return this.props.paymentMethod
    }

    static create(props: InvoicePaymentProps, id?: UniqueEntityID) {
        const invoicePayment = new InvoicePayment(props, id)

        return invoicePayment
    }
}