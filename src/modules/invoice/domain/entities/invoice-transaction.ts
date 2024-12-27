import { Entity } from @core/co@core/entiti@core/entity'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'

export interface InvoiceTransactionProps {
    invoiceId: UniqueEntityID
    transactionId: UniqueEntityID
}

export class InvoiceTransaction extends Entity<InvoiceTransactionProps> {
    get invoiceId() {
        return this.props.invoiceId
    }

    get transactionId() {
        return this.props.transactionId
    }

    static create(props: InvoiceTransactionProps, id?: UniqueEntityID) {

        const invoiceTransaction = new InvoiceTransaction(props, id)

        return invoiceTransaction
    }
}






