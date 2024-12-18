import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface BusinessAppProps {
    businessId: UniqueEntityID
    appId: UniqueEntityID
    price: number
    quantity: number
    status: string
    createdAt: Date
    updatedAt?: Date | null
}

export class BusinessApp extends AggregateRoot<BusinessAppProps> {
    get businessId() {
        return this.props.businessId
    }

    get appId() {
        return this.props.appId
    }

    get quantity() {
        return this.props.quantity
    }

    get price() {
        return this.props.price
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

    private touch() {
        this.props.updatedAt = new Date()
    }

    set businessId(businessId: UniqueEntityID) {
        this.props.businessId = businessId
        this.touch()
    }

    set appId(appId: UniqueEntityID) {
        this.props.appId = appId
        this.touch()
    }

    set price(price: number) {
        this.props.price = price
        this.touch()
    }

    set quantity(quantity: number) {
        this.props.quantity = quantity
        this.touch()
    }

    set status(status: string) {
        this.props.status = status
        this.touch()
    }

    static create(
        props: Optional<BusinessAppProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const businessApp = new BusinessApp(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),

            },
            id,
        )

        return businessApp
    }
}
