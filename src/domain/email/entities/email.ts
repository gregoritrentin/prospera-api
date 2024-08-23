import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface EmailProps {
    businessId?: UniqueEntityID
    to: string
    subject: string
    body: string
    status: string
    createdAt: Date
}

export class Email extends Entity<EmailProps> {
    get businessId() {
        return this.props.businessId
    }

    get to() {
        return this.props.to
    }

    get subject() {
        return this.props.subject
    }

    get body() {
        return this.props.body
    }

    get status() {
        return this.props.status
    }

    get createdAt() {
        return this.props.createdAt
    }

    static create(
        props: Optional<EmailProps, 'createdAt'>,
        id?: UniqueEntityID
    ) {
        const email = new Email(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),

            },
            id,
        )
        return email
    }
}
