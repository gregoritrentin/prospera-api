import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface FileProps {
    businessId: UniqueEntityID
    title: string
    url: string
    createdAt: Date
}

export class File extends Entity<FileProps> {
    get businessId() {
        return this.props.businessId
    }

    get title() {
        return this.props.title
    }

    get url() {
        return this.props.url
    }

    get createdAt() {
        return this.props.createdAt
    }

    static create(
        props: Optional<FileProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const file = new File(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),

            },
            id,
        )
        return file
    }
}
