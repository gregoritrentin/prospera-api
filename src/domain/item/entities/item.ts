import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface ItemProps {

    businessId: UniqueEntityID
    idAux: string
    description: string
    itemType: string
    price: number
    unit: string
    status: string
    groupId?: UniqueEntityID | null
    taxationId?: UniqueEntityID | null
    ncm?: string | null
    createdAt: Date
    updatedAt?: Date | null
}

export class Item extends AggregateRoot<ItemProps> {
    get businessId() {
        return this.props.businessId
    }

    get description() {
        return this.props.description
    }

    get idAux() {
        return this.props.idAux
    }

    get itemType() {
        return this.props.itemType
    }

    get price() {
        return this.props.price
    }

    get unit() {
        return this.props.unit
    }

    get status() {
        return this.props.status
    }

    get groupId() {
        return this.props.groupId
    }

    get taxationId() {
        return this.props.taxationId
    }

    get ncm() {
        return this.props.ncm || null
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

    set description(description: string) {
        this.props.description = description
        this.touch()
    }

    set idAux(idAux: string) {
        this.props.idAux = idAux
        this.touch()
    }

    set unit(unit: string) {
        this.props.unit = unit
        this.touch()
    }

    set price(price: number) {
        this.props.price = price
        this.touch()
    }

    set itemType(itemType: string) {
        this.props.itemType = itemType
        this.touch()
    }

    set status(status: string) {
        this.props.status = status
        this.touch()
    }

    set ncm(ncm: string | undefined | null) {
        if (ncm === undefined && ncm === null) {
            return
        }
        this.props.ncm = ncm
        this.touch()
    }

    set taxationId(taxationId: UniqueEntityID | undefined | null) {
        if (taxationId === undefined && taxationId === null) {
            return
        }
        this.props.taxationId = taxationId
        this.touch()
    }

    set groupId(groupId: UniqueEntityID | undefined | null) {
        if (groupId === undefined && groupId === null) {
            return
        }
        this.props.groupId = groupId
        this.touch()
    }

    static create(
        props: Optional<ItemProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const item = new Item(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),

            },
            id,
        )

        return item
    }

}
