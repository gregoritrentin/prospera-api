import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface SaleDetailsProps {
    businessId: UniqueEntityID
    businessName: string
    customerId?: UniqueEntityID
    customerName?: string
    ownerId: UniqueEntityID
    ownerName: string
    salesPersonId: UniqueEntityID
    salesPersonName: string
    channelId?: UniqueEntityID
    channelName: string
    issueDate: Date
    status: string
    notes?: string | null
    servicesAmount: number
    productAmount: number
    grossAmount: number
    discountAmount: number
    amount: number
    commissionAmount: number
    shippingAmount: number
    createdAt: Date
    updatedAt?: Date | null
}

export class SaleDetails extends AggregateRoot<SaleDetailsProps> {
    get businessId() {
        return this.props.businessId
    }

    get businessName() {
        return this.props.businessName
    }

    get customerId() {
        return this.props.customerId
    }

    get customerName() {
        return this.props.customerName
    }

    get ownerId() {
        return this.props.ownerId
    }

    get ownerName() {
        return this.props.ownerName
    }

    get salesPersonId() {
        return this.props.salesPersonId
    }

    get salesPersonName() {
        return this.props.salesPersonName
    }

    get channelId() {
        return this.props.channelId
    }

    get channelName() {
        return this.props.channelName
    }

    get issueDate() {
        return this.props.issueDate
    }

    get status() {
        return this.props.status
    }

    get notes() {
        return this.props.notes
    }

    get servicesAmount() {
        return this.props.servicesAmount
    }

    get productAmount() {
        return this.props.productAmount
    }

    get grossAmount() {
        return this.props.grossAmount
    }

    get discountAmount() {
        return this.props.discountAmount
    }

    get amount() {
        return this.props.amount
    }

    get commissionAmount() {
        return this.props.commissionAmount
    }

    get shippingAmount() {
        return this.props.shippingAmount
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    static create(props: SaleDetailsProps) {
        return new SaleDetails(props)
    }
}