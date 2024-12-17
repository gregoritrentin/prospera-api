import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export enum TransactionType {
    PIX = 'PIX',
    BOLETO = 'BOLETO',
    CARD = 'CARD',
}

export interface TransactionDetailsProps {
    businessId: UniqueEntityID;
    businessName: string;
    personId?: UniqueEntityID | null;
    personName: string | null;
    description?: string | null;
    status: string;
    type: TransactionType;

    // Datas
    dueDate?: Date | null;
    paymentDate?: Date | null;
    paymentLimitDate?: Date | null;

    // Valores
    amount: number;
    feeAmount: number;
    paymentAmount?: number | null;

    // Boleto
    ourNumber?: string | null;
    //yourNumber?: string | null;
    digitableLine?: string | null;
    barcode?: string | null;

    // PIX
    pixQrCode?: string | null;
    pixId?: string | null;
    fileId?: string | null;

    createdAt: Date;
    updatedAt?: Date | null;
}

export class TransactionDetails extends AggregateRoot<TransactionDetailsProps> {
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

    get description() {
        return this.props.description;
    }

    get status() {
        return this.props.status;
    }

    get type() {
        return this.props.type;
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

    get ourNumber() {
        return this.props.ourNumber;
    }

    // get yourNumber() {
    //     return this.props.ourNumber;
    // }

    get digitableLine() {
        return this.props.digitableLine;
    }

    get barcode() {
        return this.props.barcode;
    }

    get pixQrCode() {
        return this.props.pixQrCode;
    }

    get pixId() {
        return this.props.pixId;
    }

    get fileId() {
        return this.props.fileId;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    static create(props: TransactionDetailsProps) {
        return new TransactionDetails(props);
    }
}