import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface BoletoDetailsProps {
    businessId: UniqueEntityID;
    businessName: string;

    personId: UniqueEntityID;
    personName: string;

    documentType: string;
    ourNumber?: string | null;
    description?: string | null;
    status: string;

    //datas
    dueDate: Date;
    paymentDate?: Date | null;
    paymentLimitDate?: Date | null;

    //valores
    amount: number;
    feeAmount: number | null;
    paymentAmount?: number | null;

    digitableLine: string | null;
    barcode: string | null;
    pixQrCode?: string | null;
    pixId: string | null;

    pdfFileId?: UniqueEntityID
    pdfFileUrl?: string

    createdAt: Date;
    updatedAt?: Date | null;
}

export class BoletoDetails extends AggregateRoot<BoletoDetailsProps> {

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

    get ourNumber() {
        return this.props.ourNumber;
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

    get pdfFileId() {
        return this.props.pdfFileId;
    }

    get pdfFileUrl() {
        return this.props.pdfFileUrl;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    static create(props: BoletoDetailsProps) {
        return new BoletoDetails(props)
    }
}