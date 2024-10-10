import { ValueObject } from '@/core/entities/value-object'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ItemDetailsProps {
    businessId: UniqueEntityID
    businessName: string
    itemId: UniqueEntityID
    description: string
    idAux: string
    itemType: string
    price: number
    unit: string
    status: string
    groupId?: string | null
    taxationId?: string | null
    ncm?: string | null
    createdAt: Date
    updatedAt?: Date | null
}

export class ItemDetails extends ValueObject<ItemDetailsProps> {

    get businessId() {
        return this.props.businessId
    }

    get businessName() {
        return this.props.businessName
    }

    get itemId() {
        return this.props.itemId
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

    get groupId() {
        return this.props.groupId
    }

    get taxationId() {
        return this.props.taxationId
    }

    get ncm() {
        return this.props.ncm
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

    static create(props: ItemDetailsProps) {
        return new ItemDetails(props)
    }
}