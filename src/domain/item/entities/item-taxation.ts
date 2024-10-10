import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface ItemTaxationProps {

    businessId: UniqueEntityID
    taxation: string
    status: string
    createdAt: Date
    updatedAt?: Date | null
}

export class ItemTaxation extends AggregateRoot<ItemTaxationProps> {
    get businessId() {
        return this.props.businessId
    }

    get taxation() {
        return this.props.taxation
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

    set taxation(taxation: string) {
        this.props.taxation = taxation
        this.touch()
    }

    set status(status: string) {
        this.props.status = status
        this.touch()
    }

    static create(
        props: Optional<ItemTaxationProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const itemTaxation = new ItemTaxation(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),

            },
            id,
        )

        return itemTaxation
    }

}
