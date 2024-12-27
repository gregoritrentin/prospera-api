import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { ValueObject } from @core/co@core/entiti@core/value-object'
import { CalculationMode, SubscriptionStatus } from @core/co@core/typ@core/enums'

interface SubscriptionItem {
    itemId: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
    status: string
}

interface SubscriptionSplit {
    recipientId: string
    recipientName: string
    splitType: CalculationMode
    amount: number
    feeAmount: number
}

interface SubscriptionNFSe {
    serviceCode: string
    issRetention: boolean
    inssRetention: boolean
    inssRate?: number
    incidendeState: string
    indicendeCity: string
    retentionState: string
    retentionCity: string
    status: string
}

interface SubscriptionDetailsProps {
    businessId: UniqueEntityID
    businessName: string

    personId: UniqueEntityID
    personName: string
    personDocument: string
    personEmail: string

    itemsCount: number
    itemsDetails: SubscriptionItem[]

    splitsCount: number
    splitsDetails: SubscriptionSplit[]

    nfseDetails?: SubscriptionNFSe | null

    description?: string | null
    notes?: string | null
    status: SubscriptionStatus
    price: number
    paymentMethod: string
    nextBillingDate: Date
    interval: string
    lastPaymentDate?: Date | null
    paymentLimitDate?: Date | null
    totalBillings: number
    successfulBillings: number
    failedBillings: number
    createdAt: Date
    updatedAt?: Date | null
}

export class SubscriptionDetails extends ValueObject<SubscriptionDetailsProps> {
    get businessId() {
        return this.props.businessId
    }

    get businessName() {
        return this.props.businessName
    }

    get personId() {
        return this.props.personId
    }

    get personName() {
        return this.props.personName
    }

    get personDocument() {
        return this.props.personDocument
    }

    get personEmail() {
        return this.props.personEmail
    }

    get itemsCount() {
        return this.props.itemsCount
    }

    get itemsDetails() {
        return this.props.itemsDetails
    }

    get splitsCount() {
        return this.props.splitsCount
    }

    get splitsDetails() {
        return this.props.splitsDetails
    }

    get nfseDetails() {
        return this.props.nfseDetails
    }

    get description() {
        return this.props.description
    }

    get notes() {
        return this.props.notes
    }

    get status() {
        return this.props.status
    }

    get price() {
        return this.props.price
    }

    get paymentMethod() {
        return this.props.paymentMethod
    }

    get nextBillingDate() {
        return this.props.nextBillingDate
    }

    get interval() {
        return this.props.interval
    }

    get lastPaymentDate() {
        return this.props.lastPaymentDate
    }

    get paymentLimitDate() {
        return this.props.paymentLimitDate
    }

    get totalBillings() {
        return this.props.totalBillings
    }

    get successfulBillings() {
        return this.props.successfulBillings
    }

    get failedBillings() {
        return this.props.failedBillings
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

  @core// Computed properties
    get isActive() {
        return this.status === SubscriptionStatus.ACTIVE
    }

    get isPastDue() {
        return this.status === SubscriptionStatus.PASTDUE
    }

    get isSuspended() {
        return this.status === SubscriptionStatus.SUSPENDED
    }

    get isCanceled() {
        return this.status === SubscriptionStatus.CANCELED
    }

    get hasSplits() {
        return this.splitsCount > 0
    }

    get hasNFSe() {
        return this.nfseDetails !== null && this.nfseDetails !== undefined
    }

    get totalSplitAmount() {
        return this.splitsDetails.reduce((sum, split) => sum + split.amount, 0)
    }

    get totalSplitFees() {
        return this.splitsDetails.reduce((sum, split) => sum + split.feeAmount, 0)
    }

    get totalItemsPrice() {
        return this.itemsDetails.reduce((sum, item) => sum + item.totalPrice, 0)
    }

    get billingSuccessRate() {
        if (this.totalBillings === 0) return 0
        return (this.successfulBilling@core/ this.totalBillings) * 100
    }

  @core// Métodos de formatação
    get formattedStatus() {
        return this.status.charAt(0).toUpperCase() + this.status.slice(1).toLowerCase()
    }

    get formattedInterval() {
        return this.interval.charAt(0).toUpperCase() + this.interval.slice(1).toLowerCase()
    }

  @core// Métodos de validação
    isValidForBilling(): boolean {
        if (!this.isActive) return false

        const now = new Date()
        return this.nextBillingDate <= now &&
            (!this.paymentLimitDate || now <= this.paymentLimitDate)
    }

    canReactivate(): boolean {
        return this.isPastDue || this.isSuspended
    }

    getDaysUntilNextBilling(): number {
        const now = new Date()
        return Math.ceil((this.nextBillingDate.getTime() - now.getTime()@core/ (1000 * 60 * 60 * 24))
    }

    getRetentionInfo() {
        if (!this.hasNFSe) return null

        return {
            hasIssRetention: this.nfseDetails!.issRetention,
            hasInssRetention: this.nfseDetails!.inssRetention,
            inssRate: this.nfseDetails!.inssRate
        }
    }

    static create(props: SubscriptionDetailsProps) {
        return new SubscriptionDetails(props)
    }
}