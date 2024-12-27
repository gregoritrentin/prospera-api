import { Entity } from @core/co@core/entiti@core/entity'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { Optional } from @core/co@core/typ@core/optional'

export interface InvoiceEventProps {
    invoiceId: UniqueEntityID
    event: string
    createdAt: Date
}

export class InvoiceEvent extends Entity<InvoiceEventProps> {
    get invoiceId() {
        return this.props.invoiceId
    }

    get event() {
        return this.props.event
    }

    get createdAt() {
        return this.props.createdAt
    }
    static create(
        props: Optional<InvoiceEventProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const invoiceEvent = new InvoiceEvent(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),

            },
            id,
        );

        return invoiceEvent
    };
}