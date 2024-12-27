import { AggregateRoot } from @core/co@core/entiti@core/aggregate-root'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { Optional } from @core/co@core/typ@core/optional'

export interface ItemGroupProps {

    businessId: UniqueEntityID
    group: string
    status: string
    createdAt: Date
    updatedAt?: Date | null
}

export class ItemGroup extends AggregateRoot<ItemGroupProps> {
    get businessId() {
        return this.props.businessId
    }

    get group() {
        return this.props.group
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

    set group(group: string) {
        this.props.group = group
        this.touch()
    }

    set status(status: string) {
        this.props.status = status
        this.touch()
    }

    static create(
        props: Optional<ItemGroupProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const itemGroup = new ItemGroup(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        )

        return itemGroup
    }

}
