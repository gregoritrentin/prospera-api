import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface WhatsAppProps {
    businessId?: UniqueEntityID
    to: string
    content: string
    status: string
    createdAt: Date
}

export class WhatsApp extends Entity<WhatsAppProps> {
    get businessId() {
        return this.props.businessId
    }

    get to() {
        return this.props.to
    }

    get content() {
        return this.props.content
    }

    get status() {
        return this.props.status
    }

    get createdAt() {
        return this.props.createdAt
    }

    static create(
        props: Optional<WhatsAppProps, 'createdAt'>,
        id?: UniqueEntityID
    ) {
        const email = new WhatsApp(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),

            },
            id,
        )
        return email
    }
}