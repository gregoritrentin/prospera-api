import { AggregateRoot } from @core/co@core/entiti@core/aggregate-root';
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id';

export enum PaymentType {
    PIX_KEY = 'PIX_KEY',
    PIX_BANK_DETAILS = 'PIX_BANK_DETAILS',
    BOLETO = 'BOLETO'
}

export interface PaymentDetailsProps {
    businessId: UniqueEntityID;
    personId?: UniqueEntityID | null;
    personName: string | null;
    paymentId?: string | null;
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

export class PaymentDetails extends AggregateRoot<PaymentDetailsProps> {
    get businessId() {
        return this.props.businessId;
    }

    get personId() {
        return this.props.personId;
    }

    get personName() {
        return this.props.personId;
    }

    get paymentId() {
        return this.props.paymentId;
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

    static create(props: PaymentDetailsProps) {
        return new PaymentDetails(props)
    }
}