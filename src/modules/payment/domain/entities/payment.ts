import { AggregateRoot } from @core/co@core/entiti@core/aggregate-root';
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id';
import { Optional } from @core/co@core/typ@core/optional';

export enum PaymentType {
    PIX_KEY = 'PIX_KEY',
    PIX_BANK_DATA = 'PIX_BANK_DETAILS',
}

export interface PaymentProps {
    businessId: UniqueEntityID;
    personId?: UniqueEntityID | null;
    paymentId?: string | null;
    accountId: string;
    paymentType: PaymentType;
    description?: string | null;
    status: string;
    amount: number;
    feeAmount: number;
    paymentDate: Date;
    pixMessage?: string | null;
    pixKey?: string | null;
    beneficiaryIspb?: string | null;
    beneficiaryBranch?: string | null;
    beneficiaryAccount?: string | null;
    beneficiaryAccountType?: string | null;
    beneficiaryName?: string | null;
    beneficiaryDocument?: string | null;
    barCode?: string | null;

    createdAt: Date;
    updatedAt?: Date | null;
}

export class Payment extends AggregateRoot<PaymentProps> {
    get businessId() {
        return this.props.businessId;
    }

    get personId() {
        return this.props.personId;
    }

    get paymentId() {
        return this.props.paymentId;
    }

    get accountId() {
        return this.props.accountId;
    }

    get paymentType() {
        return this.props.paymentType;
    }

    get description() {
        return this.props.description;
    }

    get status() {
        return this.props.status;
    }

    get amount() {
        return this.props.amount;
    }

    get feeAmount() {
        return this.props.feeAmount;
    }

    get paymentDate() {
        return this.props.paymentDate;
    }

    get pixMessage() {
        return this.props.pixMessage;
    }

    get pixKey() {
        return this.props.pixKey;
    }

    get beneficiaryIspb() {
        return this.props.beneficiaryIspb;
    }

    get beneficiaryBranch() {
        return this.props.beneficiaryBranch;
    }

    get beneficiaryAccount() {
        return this.props.beneficiaryAccount;
    }

    get beneficiaryAccountType() {
        return this.props.beneficiaryAccountType;
    }

    get beneficiaryName() {
        return this.props.beneficiaryName;
    }

    get beneficiaryDocument() {
        return this.props.beneficiaryDocument;
    }

    get barCode() {
        return this.props.barCode;
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

    set businessId(businessId: UniqueEntityID) {
        this.props.businessId = businessId;
        this.touch();
    }

    set personId(personId: UniqueEntityID | null | undefined) {
        this.props.personId = personId;
        this.touch();
    }

    set accountId(accountId: string) {
        this.props.accountId = accountId;
        this.touch();
    }

    set paymentId(paymentId: string | null | undefined) {
        this.props.paymentId = paymentId;
        this.touch();
    }

    set paymentType(paymentType: PaymentType) {
        this.props.paymentType = paymentType;
        this.touch();
    }

    set description(description: string | null | undefined) {
        this.props.description = description;
        this.touch();
    }

    set status(status: string) {
        this.props.status = status;
        this.touch();
    }

    set amount(amount: number) {
        this.props.amount = amount;
        this.touch();
    }

    set feeAmount(feeAmount: number) {
        this.props.feeAmount = feeAmount;
        this.touch();
    }

    set paymentDate(paymentDate: Date) {
        this.props.paymentDate = paymentDate;
        this.touch();
    }

    set pixMessage(pixMessage: string | null | undefined) {
        this.props.pixMessage = pixMessage;
        this.touch();
    }

    set pixKey(pixKey: string | null | undefined) {
        this.props.pixKey = pixKey;
        this.touch();
    }

    set beneficiaryIspb(beneficiaryIspb: string | null | undefined) {
        this.props.beneficiaryIspb = beneficiaryIspb;
        this.touch();
    }

    set beneficiaryBranch(beneficiaryBranch: string | null | undefined) {
        this.props.beneficiaryBranch = beneficiaryBranch;
        this.touch();
    }

    set beneficiaryAccount(beneficiaryAccount: string | null | undefined) {
        this.props.beneficiaryAccount = beneficiaryAccount;
        this.touch();
    }

    set beneficiaryAccountType(beneficiaryAccountType: string | null | undefined) {
        this.props.beneficiaryAccountType = beneficiaryAccountType;
        this.touch();
    }

    set beneficiaryName(beneficiaryName: string | null | undefined) {
        this.props.beneficiaryName = beneficiaryName;
        this.touch();
    }

    set beneficiaryDocument(beneficiaryDocument: string | null | undefined) {
        this.props.beneficiaryDocument = beneficiaryDocument;
        this.touch();
    }

    set barCode(barCode: string | null | undefined) {
        this.props.barCode = barCode;
        this.touch();
    }

    static create(
        props: Optional<PaymentProps, 'createdAt' | 'updatedAt'>,
        id?: UniqueEntityID,
    ) {
        const payment = new Payment(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        );

        return payment;
    }
}