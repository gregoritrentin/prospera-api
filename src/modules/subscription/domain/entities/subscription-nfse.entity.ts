import { Entity } from @core/co@core/entiti@core/entity'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'

export interface SubscriptionNFSeProps {
    subscriptionId: UniqueEntityID
    serviceCode: string
    issRetention: boolean
    inssRetention: boolean
    inssRate?: number
    incidendeState: string
    indicendeCity: string
    retentionState: string
    retentionCity: string
    status: string
    createdAt: Date
    updatedAt?: Date | null
}

export class SubscriptionNFSe extends Entity<SubscriptionNFSeProps> {
    get subscriptionId() {
        return this.props.subscriptionId
    }

    get serviceCode() {
        return this.props.serviceCode
    }

    get issRetention() {
        return this.props.issRetention
    }

    get inssRetention() {
        return this.props.inssRetention
    }

    get inssRate() {
        return this.props.inssRate
    }

    get incidendeState() {
        return this.props.incidendeState
    }

    get indicendeCity() {
        return this.props.indicendeCity
    }

    get retentionState() {
        return this.props.retentionState
    }

    get retentionCity() {
        return this.props.retentionCity
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

    set status(status: string) {
        this.props.status = status
        this.touch()
    }

    static create(props: SubscriptionNFSeProps, id?: UniqueEntityID) {
        const subscriptionNFSe = new SubscriptionNFSe(props, id)
        return subscriptionNFSe
    }
}