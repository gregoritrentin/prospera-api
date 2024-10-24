import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface InvoiceAttachmentProps {
    invoiceId: UniqueEntityID
    fileId: UniqueEntityID
    createdAt: Date
}

export class InvoiceAttachment extends Entity<InvoiceAttachmentProps> {
    get invoiceId() {
        return this.props.invoiceId
    }

    get fileId() {
        return this.props.fileId
    }

    get createdAt() {
        return this.props.createdAt
    }

    static create(props: Omit<InvoiceAttachmentProps, 'createdAt'>, id?: UniqueEntityID) {
        const invoiceAttachment = new InvoiceAttachment({
            ...props,
            createdAt: new Date()
        }, id)

        return invoiceAttachment
    }
}