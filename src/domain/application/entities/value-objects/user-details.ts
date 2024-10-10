import { ValueObject } from '@/core/entities/value-object'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
export interface UserDetailsProps {

    id: UniqueEntityID
    name: string
    email: string
    defaultBusiness: string | null
    photoFileUrl: string | null
    photoFileId: string | null
    status: string
    createdAt: Date
    updatedAt?: Date | null
}

export class UserDetails extends ValueObject<UserDetailsProps> {

    get id() {
        return this.props.id
    }

    get name() {
        return this.props.name
    }

    get email() {
        return this.props.email
    }

    get status() {
        return this.props.status
    }

    get defaultBusiness() {
        return this.props.defaultBusiness
    }

    get photoFileId() {
        return this.props.photoFileId
    }

    get photoFileUrl() {
        return this.props.photoFileUrl
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    static create(props: UserDetailsProps) {
        return new UserDetails(props)
    }
}