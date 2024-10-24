import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

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