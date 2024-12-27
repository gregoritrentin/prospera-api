import { AggregateRoot } from @core/co@core/entiti@core/aggregate-root';
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id';
import { Optional } from @core/co@core/typ@core/optional';

export enum TransactionType {
    PIX = 'PIX',
    BOLETO = 'BOLETO',
    CARD = 'CARD',
}

export interface TransactionProps {
    businessId: UniqueEntityID;
    personId?: UniqueEntityID | null;
    description?: string | null;
    status: string;
    type: TransactionType;

  @core// Datas
    dueDate?: Date | null;
    paymentDate?: Date | null;
    paymentLimitDate?: Date | null;

  @core// Valores
    amount: number;
    feeAmount: number;
    paymentAmount?: number | null;

  @core// Boleto
    ourNumber?: string | null;
    digitableLine?: string | null;
    barcode?: string | null;

  @core// PIX
    pixQrCode?: string | null;
    pixId?: string | null;
    fileId?: string | null;

    createdAt: Date;
    updatedAt?: Date | null;
}

export class Transaction extends AggregateRoot<TransactionProps> {
    get businessId() {
        return this.props.businessId;
    }

    get personId() {
        return this.props.personId;
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

    set description(description: string | null | undefined) {
        this.props.description = description;
        this.touch();
    }

    set status(status: string) {
        this.props.status = status;
        this.touch();
    }

    set type(type: TransactionType) {
        this.props.type = type;
        this.touch();
    }

    set dueDate(dueDate: Date | null | undefined) {
        this.props.dueDate = dueDate;
        this.touch();
    }

    set paymentDate(paymentDate: Date | null | undefined) {
        this.props.paymentDate = paymentDate;
        this.touch();
    }

    set paymentLimitDate(paymentLimitDate: Date | null | undefined) {
        this.props.paymentLimitDate = paymentLimitDate;
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

    set paymentAmount(paymentAmount: number | null | undefined) {
        this.props.paymentAmount = paymentAmount;
        this.touch();
    }

    set ourNumber(ourNumber: string | null | undefined) {
        this.props.ourNumber = ourNumber;
        this.touch();
    }

    set digitableLine(digitableLine: string | null | undefined) {
        this.props.digitableLine = digitableLine;
        this.touch();
    }

    set barcode(barcode: string | null | undefined) {
        this.props.barcode = barcode;
        this.touch();
    }

    set pixQrCode(pixQrCode: string | null | undefined) {
        this.props.pixQrCode = pixQrCode;
        this.touch();
    }

    set pixId(pixId: string | null | undefined) {
        this.props.pixId = pixId;
        this.touch();
    }

    set fileId(fileId: string | null | undefined) {
        this.props.fileId = fileId;
        this.touch();
    }

    static create(
        props: Optional<TransactionProps, 'createdAt' | 'updatedAt'>,
        id?: UniqueEntityID,
    ) {
        const transaction = new Transaction(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
            },
            id,
        );

        return transaction;
    }
}