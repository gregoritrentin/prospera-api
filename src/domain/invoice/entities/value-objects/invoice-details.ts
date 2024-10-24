import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { CalculationMode, YesNo } from '@prisma/client';

export interface InvoiceDetailsProps {
    businessId: UniqueEntityID;
    personId: UniqueEntityID;
    description?: string | null;
    notes?: string | null;
    paymentLink: string;
    status: string;
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

export class InvoiceDetails {
    private constructor(private readonly props: InvoiceDetailsProps) { }

    static create(props: InvoiceDetailsProps): InvoiceDetails {
        // Here you can add validation logic if needed
        return new InvoiceDetails(props);
    }

    get businessId(): UniqueEntityID {
        return this.props.businessId;
    }

    get personId(): UniqueEntityID {
        return this.props.personId;
    }

    get description(): string | null | undefined {
        return this.props.description;
    }

    get notes(): string | null | undefined {
        return this.props.notes;
    }

    get paymentLink(): string {
        return this.props.paymentLink;
    }

    get status(): string {
        return this.props.status;
    }

    get issueDate(): Date {
        return this.props.issueDate;
    }

    get dueDate(): Date {
        return this.props.dueDate;
    }

    get paymentDate(): Date {
        return this.props.paymentDate;
    }

    get paymentLimitDate(): Date | null | undefined {
        return this.props.paymentLimitDate;
    }

    get grossAmount(): number {
        return this.props.grossAmount;
    }

    get discountAmount(): number {
        return this.props.discountAmount;
    }

    get amount(): number {
        return this.props.amount;
    }

    get paymentAmount(): number {
        return this.props.paymentAmount;
    }

    get protestMode(): YesNo {
        return this.props.protestMode;
    }

    get protestDays(): number {
        return this.props.protestDays;
    }

    get lateMode(): CalculationMode {
        return this.props.lateMode;
    }

    get lateValue(): number {
        return this.props.lateValue;
    }

    get interestMode(): CalculationMode {
        return this.props.interestMode;
    }

    get interestDays(): number {
        return this.props.interestDays;
    }

    get interestValue(): number {
        return this.props.interestValue;
    }

    get discountMode(): CalculationMode {
        return this.props.discountMode;
    }

    get discountDays(): number {
        return this.props.discountDays;
    }

    get discountValue(): number {
        return this.props.discountValue;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date | null | undefined {
        return this.props.updatedAt;
    }
}