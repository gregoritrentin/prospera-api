import { ValueObject } from '@core/domain/entity/value-object'
import { UniqueEntityID } from '@core/domain/entity/unique-entity-id'

export interface BusinessAppDetailsProps {
    businessId: UniqueEntityID
    appId: UniqueEntityID
    appName: string
    price: number
    quantity: number
    status: string
    createdAt: Date
    updatedAt?: Date | null
}

export class BusinessAppDetails extends ValueObject<BusinessAppDetailsProps> {

    get businessId() {
        return this.props.businessId
    }

    get appId() {
        return this.props.appId
    }

    get appName() {
        return this.props.appName
    }

    get price() {
        return this.props.price
    }

    get quantity() {
        return this.props.quantity
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

    static create(props: BusinessAppDetailsProps) {
        return new BusinessAppDetails(props)
    }
}