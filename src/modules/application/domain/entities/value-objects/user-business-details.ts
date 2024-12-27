import { ValueObject } from '@core/domain/entity/value-object'
import { UniqueEntityID } from '@core/domain/entity/unique-entity-id'

export interface UserBusinessDetailsProps {
    businessId: UniqueEntityID
    businessName: string
    userId: UniqueEntityID
    userName: string
    role: string
    status: string
    createdAt: Date
    updatedAt?: Date | null
}

export class UserBusinessDetails extends ValueObject<UserBusinessDetailsProps> {

    get businessId() {
        return this.props.businessId
    }

    get businessName() {
        return this.props.businessName
    }
    get userId() {
        return this.props.userId
    }

    get userName() {
        return this.props.userName
    }

    get role() {
        return this.props.role
    }

    get status() {
        return this.props.status
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    static create(props: UserBusinessDetailsProps) {
        return new UserBusinessDetails(props)
    }
}