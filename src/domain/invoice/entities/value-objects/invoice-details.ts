import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { CalculationMode, InvoiceStatus, YesNo } from '@/core/types/enums'

interface InvoiceItemSummary {
    itemId: string
    description: string
    quantity: number
    amount: number
}

interface InvoiceSplitSummary {
    recipientId: string
    recipientName: string
    splitType: CalculationMode
    amount: number
    feeAmount: number
}

interface InvoiceDetailsProps {
    businessId: UniqueEntityID
    businessName: string

    personId: UniqueEntityID
    personName: string
    personDocument: string
    personEmail: string

    itemsCount: number
    itemsDetails: InvoiceItemSummary[]

    splitsCount: number
    splitsDetails: InvoiceSplitSummary[]

    description?: string | null
    notes?: string | null
    paymentLink: string
    status: InvoiceStatus
    issueDate: Date
    dueDate: Date
    paymentDate?: Date | null
    paymentLimitDate?: Date | null
    grossAmount: number
    discountAmount: number
    amount: number
    paymentAmount: number
    protestMode: YesNo
    protestDays: number
    lateMode: CalculationMode
    lateValue: number
    interestMode: CalculationMode
    interestDays: number
    interestValue: number
    discountMode: CalculationMode
    discountDays: number
    discountValue: number
    createdAt: Date
    updatedAt?: Date | null
}

export class InvoiceDetails extends ValueObject<InvoiceDetailsProps> {
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

    get description() {
        return this.props.description
    }

    get notes() {
        return this.props.notes
    }

    get paymentLink() {
        return this.props.paymentLink
    }

    get status() {
        return this.props.status
    }

    get issueDate() {
        return this.props.issueDate
    }

    get dueDate() {
        return this.props.dueDate
    }

    get paymentDate() {
        return this.props.paymentDate
    }

    get paymentLimitDate() {
        return this.props.paymentLimitDate
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

    get paymentAmount() {
        return this.props.paymentAmount
    }

    get protestMode() {
        return this.props.protestMode
    }

    get protestDays() {
        return this.props.protestDays
    }

    get lateMode() {
        return this.props.lateMode
    }

    get lateValue() {
        return this.props.lateValue
    }

    get interestMode() {
        return this.props.interestMode
    }

    get interestDays() {
        return this.props.interestDays
    }

    get interestValue() {
        return this.props.interestValue
    }

    get discountMode() {
        return this.props.discountMode
    }

    get discountDays() {
        return this.props.discountDays
    }

    get discountValue() {
        return this.props.discountValue
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updatedAt() {
        return this.props.updatedAt
    }

    // Computed properties
    get netAmount() {
        return this.grossAmount - this.discountAmount
    }

    get isPaid() {
        return this.status === InvoiceStatus.PAID
    }

    get isOverdue() {
        const now = new Date()
        return !this.isPaid && this.dueDate < now
    }

    get hasDiscount() {
        return this.discountMode !== CalculationMode.NONE && this.discountValue > 0
    }

    get hasInterest() {
        return this.interestMode !== CalculationMode.NONE && this.interestValue > 0
    }

    get hasLateCharges() {
        return this.lateMode !== CalculationMode.NONE && this.lateValue > 0
    }

    get hasSplits() {
        return this.splitsCount > 0
    }

    get totalSplitAmount() {
        return this.splitsDetails.reduce((sum, split) => sum + split.amount, 0)
    }

    get totalSplitFees() {
        return this.splitsDetails.reduce((sum, split) => sum + split.feeAmount, 0)
    }

    // Métodos de formatação
    get formattedStatus() {
        return this.status.charAt(0).toUpperCase() + this.status.slice(1).toLowerCase()
    }

    // Métodos de validação
    isValidForPayment(): boolean {
        return !this.isPaid && this.paymentAmount > 0 && this.paymentAmount <= this.amount
    }

    canApplyDiscount(date: Date = new Date()): boolean {
        if (!this.hasDiscount) return false

        const diffInDays = Math.floor((date.getTime() - this.issueDate.getTime()) / (1000 * 60 * 60 * 24))
        return diffInDays <= this.discountDays
    }

    calculateInterest(date: Date = new Date()): number {
        if (!this.isOverdue || !this.hasInterest) return 0

        const diffInDays = Math.floor((date.getTime() - this.dueDate.getTime()) / (1000 * 60 * 60 * 24))
        const periods = Math.floor(diffInDays / this.interestDays)

        if (periods <= 0) return 0

        if (this.interestMode === CalculationMode.PERCENT) {
            return (this.amount * (this.interestValue / 100)) * periods
        }

        return this.interestValue * periods
    }

    calculateLateCharges(date: Date = new Date()): number {
        if (!this.isOverdue || !this.hasLateCharges) return 0

        if (this.lateMode === CalculationMode.PERCENT) {
            return this.amount * (this.lateValue / 100)
        }

        return this.lateValue
    }

    static create(props: InvoiceDetailsProps) {
        return new InvoiceDetails(props)
    }
}