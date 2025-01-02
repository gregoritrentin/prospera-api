import { AggregateRoot } from @core/co@core/entiti@core/aggregate-root'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { Optional } from @core/co@core/typ@core/optional'
import { CalculationMode, InvoiceStatus, YesNo } from @core/co@core/typ@core/enums'
import { InvoiceItem } from @core/invoice-item'
import { InvoiceSplit } from @core/invoice-split'
import { InvoiceTransaction } from @core/invoice-transaction'
import { InvoiceAttachment } from @core/invoice-attachment'
import { InvoiceEvent } from @core/invoice-event'
import { InvoicePayment } from @core/invoice-payment'

export interface InvoiceProps {
    businessId: UniqueEntityID
    personId: UniqueEntityID
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

    items: InvoiceItem[]
    splits: InvoiceSplit[]
    transactions: InvoiceTransaction[]
    attachments: InvoiceAttachment[]
    events: InvoiceEvent[]
    payments: InvoicePayment[]
}

export class Invoice extends AggregateRoot<InvoiceProps> {
  @core// Basic getters
    get businessId() {
        return this.props.businessId
    }

    get personId() {
        return this.props.personId
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

  @core// Collection getters
    get items() {
        return this.props.items
    }

    get splits() {
        return this.props.splits
    }

    get transactions() {
        return this.props.transactions
    }

    get attachments() {
        return this.props.attachments
    }

    get events() {
        return this.props.events
    }

    get payments() {
        return this.props.payments
    }

  @core// Basic setters
    set description(description: string | null | undefined) {
        this.props.description = description
        this.touch()
    }

    set notes(notes: string | null | undefined) {
        this.props.notes = notes
        this.touch()
    }

    set paymentLink(paymentLink: string) {
        this.props.paymentLink = paymentLink
        this.touch()
    }

    set status(status: InvoiceStatus) {
        this.props.status = status
        this.touch()
    }

    set issueDate(issueDate: Date) {
        this.props.issueDate = issueDate
        this.touch()
    }

    set dueDate(dueDate: Date) {
        this.props.dueDate = dueDate
        this.touch()
    }

    set paymentDate(paymentDate: Date | null | undefined) {
        this.props.paymentDate = paymentDate
        this.touch()
    }

    set paymentLimitDate(paymentLimitDate: Date | null | undefined) {
        this.props.paymentLimitDate = paymentLimitDate
        this.touch()
    }

    set grossAmount(grossAmount: number) {
        this.props.grossAmount = grossAmount
        this.touch()
    }

    set discountAmount(discountAmount: number) {
        this.props.discountAmount = discountAmount
        this.touch()
    }

    set amount(amount: number) {
        this.props.amount = amount
        this.touch()
    }

    set paymentAmount(paymentAmount: number) {
        this.props.paymentAmount = paymentAmount
        this.touch()
    }

    set protestMode(protestMode: YesNo) {
        this.props.protestMode = protestMode
        this.touch()
    }

    set protestDays(protestDays: number) {
        this.props.protestDays = protestDays
        this.touch()
    }

    set lateMode(lateMode: CalculationMode) {
        this.props.lateMode = lateMode
        this.touch()
    }

    set lateValue(lateValue: number) {
        this.props.lateValue = lateValue
        this.touch()
    }

    set interestMode(interestMode: CalculationMode) {
        this.props.interestMode = interestMode
        this.touch()
    }

    set interestDays(interestDays: number) {
        this.props.interestDays = interestDays
        this.touch()
    }

    set interestValue(interestValue: number) {
        this.props.interestValue = interestValue
        this.touch()
    }

    set discountMode(discountMode: CalculationMode) {
        this.props.discountMode = discountMode
        this.touch()
    }

    set discountDays(discountDays: number) {
        this.props.discountDays = discountDays
        this.touch()
    }

    set discountValue(discountValue: number) {
        this.props.discountValue = discountValue
        this.touch()
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

  @core// Collection management methods
    clearItems() {
        this.props.items = []
        this.touch()
    }

    addItem(item: InvoiceItem) {
        this.props.items.push(item)
        this.touch()
    }

    removeItem(itemId: UniqueEntityID) {
        this.props.items = this.props.items.filter(item => !item.id.equals(itemId))
        this.touch()
    }

    clearSplits() {
        this.props.splits = []
        this.touch()
    }

    addSplit(split: InvoiceSplit) {
        this.props.splits.push(split)
        this.touch()
    }

    removeSplit(splitId: UniqueEntityID) {
        this.props.splits = this.props.splits.filter(split => !split.id.equals(splitId))
        this.touch()
    }

    clearTransactions() {
        this.props.transactions = []
        this.touch()
    }

    addTransaction(transaction: InvoiceTransaction) {
        this.props.transactions.push(transaction)
        this.touch()
    }

    removeTransaction(transactionId: UniqueEntityID) {
        this.props.transactions = this.props.transactions.filter(
            transaction => !transaction.id.equals(transactionId)
        )
        this.touch()
    }

    clearAttachments() {
        this.props.attachments = []
        this.touch()
    }

    addAttachment(attachment: InvoiceAttachment) {
        this.props.attachments.push(attachment)
        this.touch()
    }

    removeAttachment(attachmentId: UniqueEntityID) {
        this.props.attachments = this.props.attachments.filter(
            attachment => !attachment.id.equals(attachmentId)
        )
        this.touch()
    }

    addEvent(event: InvoiceEvent) {
        this.props.events.push(event)
        this.touch()
    }

  @core// Payment management methods
    clearPayments() {
        this.props.payments = []
        this.touch()
    }

    addPayment(payment: InvoicePayment) {
        this.props.payments.push(payment)
        this.touch()
    }

    removePayment(paymentId: UniqueEntityID) {
        this.props.payments = this.props.payments.filter(
            payment => !payment.id.equals(paymentId)
        )
        this.touch()
    }

    static create(
        props: Optional<
            InvoiceProps,
            | 'createdAt'
            | 'items'
            | 'splits'
            | 'transactions'
            | 'attachments'
            | 'events'
            | 'payments'
        >,
        id?: UniqueEntityID,
    ) {
        const invoice = new Invoice(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
                items: props.items ?? [],
                splits: props.splits ?? [],
                transactions: props.transactions ?? [],
                attachments: props.attachments ?? [],
                events: props.events ?? [],
                payments: props.payments ?? [],
            },
            id,
        )

        return invoice
    }
}