import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { CalculationMode, InvoiceStatus, YesNo } from '@/core/types/enums';
import { Optional } from '@/core/types/optional';

export interface InvoiceProps {
    businessId: UniqueEntityID;
    personId: UniqueEntityID;
    description?: string | null;
    notes?: string | null;
    paymentLink: string;
    status: InvoiceStatus;
    issueDate: Date;
    dueDate: Date;
    paymentDate: Date;
    paymentLimitDate?: Date | null;
    grossAmount: number;
    discountAmount: number;
    amount: number;
    paymentAmount: number;
    protestMode: YesNo;
    protestDays: number;
    lateMode: CalculationMode;
    lateValue: number;
    interestMode: CalculationMode;
    interestDays: number;
    interestValue: number;
    discountMode: CalculationMode;
    discountDays: number;
    discountValue: number;
    createdAt: Date;
    updatedAt?: Date | null;
}

export class Invoice extends AggregateRoot<InvoiceProps> {
    get businessId() {
        return this.props.businessId;
    }

    set businessId(value: UniqueEntityID) {
        this.props.businessId = value;
        this.touch();
    }

    get personId() {
        return this.props.personId;
    }

    set personId(value: UniqueEntityID) {
        this.props.personId = value;
        this.touch();
    }

    get description() {
        return this.props.description;
    }

    set description(value: string | null | undefined) {
        this.props.description = value;
        this.touch();
    }

    get notes() {
        return this.props.notes;
    }

    set notes(value: string | null | undefined) {
        this.props.notes = value;
        this.touch();
    }

    get paymentLink() {
        return this.props.paymentLink;
    }

    set paymentLink(value: string) {
        this.props.paymentLink = value;
        this.touch();
    }

    get status() {
        return this.props.status;
    }

    set status(value: InvoiceStatus) {
        this.props.status = value;
        this.touch();
    }

    get issueDate() {
        return this.props.issueDate;
    }

    set issueDate(value: Date) {
        this.props.issueDate = value;
        this.touch();
    }

    get dueDate() {
        return this.props.dueDate;
    }

    set dueDate(value: Date) {
        this.props.dueDate = value;
        this.touch();
    }

    get paymentDate() {
        return this.props.paymentDate;
    }

    set paymentDate(value: Date) {
        this.props.paymentDate = value;
        this.touch();
    }

    get paymentLimitDate() {
        return this.props.paymentLimitDate;
    }

    set paymentLimitDate(value: Date | null | undefined) {
        this.props.paymentLimitDate = value;
        this.touch();
    }

    get grossAmount() {
        return this.props.grossAmount;
    }

    set grossAmount(value: number) {
        this.props.grossAmount = value;
        this.touch();
    }

    get discountAmount() {
        return this.props.discountAmount;
    }

    set discountAmount(value: number) {
        this.props.discountAmount = value;
        this.touch();
    }

    get amount() {
        return this.props.amount;
    }

    set amount(value: number) {
        this.props.amount = value;
        this.touch();
    }

    get paymentAmount() {
        return this.props.paymentAmount;
    }

    set paymentAmount(value: number) {
        this.props.paymentAmount = value;
        this.touch();
    }

    get protestMode() {
        return this.props.protestMode;
    }

    set protestMode(value: YesNo) {
        this.props.protestMode = value;
        this.touch();
    }

    get protestDays() {
        return this.props.protestDays;
    }

    set protestDays(value: number) {
        this.props.protestDays = value;
        this.touch();
    }

    get lateMode() {
        return this.props.lateMode;
    }

    set lateMode(value: CalculationMode) {
        this.props.lateMode = value;
        this.touch();
    }

    get lateValue() {
        return this.props.lateValue;
    }

    set lateValue(value: number) {
        this.props.lateValue = value;
        this.touch();
    }

    get interestMode() {
        return this.props.interestMode;
    }

    set interestMode(value: CalculationMode) {
        this.props.interestMode = value;
        this.touch();
    }

    get interestDays() {
        return this.props.interestDays;
    }

    set interestDays(value: number) {
        this.props.interestDays = value;
        this.touch();
    }

    get interestValue() {
        return this.props.interestValue;
    }

    set interestValue(value: number) {
        this.props.interestValue = value;
        this.touch();
    }

    get discountMode() {
        return this.props.discountMode;
    }

    set discountMode(value: CalculationMode) {
        this.props.discountMode = value;
        this.touch();
    }

    get discountDays() {
        return this.props.discountDays;
    }

    set discountDays(value: number) {
        this.props.discountDays = value;
        this.touch();
    }

    get discountValue() {
        return this.props.discountValue;
    }

    set discountValue(value: number) {
        this.props.discountValue = value;
        this.touch();
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    private touch() {
        this.props.updatedAt = new Date();
    }

    static create(
        props: Optional<InvoiceProps, 'createdAt' | 'updatedAt'>,
        id?: UniqueEntityID,
    ) {
        const invoice = new Invoice(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
                updatedAt: props.updatedAt ?? null,
            },
            id,
        );

        return invoice;
    }
}