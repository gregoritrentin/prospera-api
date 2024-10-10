import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface BoletoProps {
    businessId: UniqueEntityID;
    personId: UniqueEntityID;
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

    digitableLine?: string | null;
    barcode?: string | null;
    pixQrCode?: string | null;
    pixId?: string | null;
    pdfFileId?: string | null;

    createdAt: Date;
    updatedAt?: Date | null;
}

export class Boleto extends AggregateRoot<BoletoProps> {
    isLeft() {
        throw new Error('Method not implemented.');
    }

    get businessId() {
        return this.props.businessId;
    }

    get personId() {
        return this.props.personId;
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

    set personId(personId: UniqueEntityID) {
        this.props.personId = personId;
        this.touch();
    }

    set documentType(documentType: string) {
        this.props.documentType = documentType;
        this.touch();
    }

    set ourNumber(ourNumber: string | null | undefined) {
        this.props.ourNumber = ourNumber;
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

    set dueDate(dueDate: Date) {
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

    set feeAmount(feeAmount: number | null) {
        this.props.feeAmount = feeAmount;
        this.touch();
    }

    set paymentAmount(paymentAmount: number | null | undefined) {
        this.props.paymentAmount = paymentAmount;
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

    set pdfFileId(pdfFileId: string | null | undefined) {
        this.props.pdfFileId = pdfFileId;
        this.touch();
    }

    static create(
        props: Optional<BoletoProps, 'createdAt'>,
        //        props: Optional<BoletoProps, 'createdAt' | 'updatedAt' | 'ourNumber' | 'paymentDate' | 'paymentAmount' | 'digitableLine' | 'barcode' | 'pixQrCode' | 'pixId'>,
        id?: UniqueEntityID,
    ) {
        const boleto = new Boleto(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),
                // updatedAt: props.updatedAt ?? null,
                // ourNumber: props.ourNumber ?? null,
                // paymentDate: props.paymentDate ?? null,
                // paymentAmount: props.paymentAmount ?? null,
                // digitableLine: props.digitableLine ?? null,
                // barcode: props.barcode ?? null,
                // pixQrCode: props.pixQrCode ?? null,
                // pixId: props.pixId ?? null,
            },
            id,
        );

        return boleto;
    }
}