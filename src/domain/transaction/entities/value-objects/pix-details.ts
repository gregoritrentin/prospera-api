import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface PixDetailsProps {
    businessId: UniqueEntityID;
    businessName: string;

    personId?: UniqueEntityID;
    personName: string;

    documentType: string;
    description?: string | null;
    status: string;

    //datas
    dueDate?: Date;
    paymentDate?: Date | null;
    paymentLimitDate?: Date | null;

    //valores
    amount: number;
    feeAmount: number | null;
    paymentAmount?: number | null;

    pixQrCode?: string | null;
    pixId: string | null;

    createdAt: Date;
    updatedAt?: Date | null;
}

export class PixDetails extends AggregateRoot<PixDetailsProps> {

    get businessId() {
        return this.props.businessId;
    }

    get businessName() {
        return this.props.businessName;
    }

    get personId() {
        return this.props.personId;
    }

    get personName() {
        return this.props.personName;
    }

    get documentType() {
        return this.props.documentType;
    }

    get description() {
        return this.props.description;
    }

    get status() {
        return this.props.status;
    }

    get dueDate() {
        return this.props.dueDate;
    }

    get paymentDate() {
        return this.props.paymentDate;
    }

    get paymentLimitDate() {
        return this.props.paymentLimitDate;
    }

    get amount() {
        return this.props.amount;
    }

    get feeAmount() {
        return this.props.feeAmount;
    }

    get paymentAmount() {
        return this.props.paymentAmount;
    }

    get pixQrCode() {
        return this.props.pixQrCode;
    }

    get pixId() {
        return this.props.pixId;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    static create(props: PixDetailsProps) {
        return new PixDetails(props)
    }
}