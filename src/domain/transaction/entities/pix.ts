import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Optional } from '@/core/types/optional';

export interface PixProps {
    businessId: UniqueEntityID;
    personId?: UniqueEntityID | null;
    documentType: string; //IMEDIATE, DUEDATE
    description?: string | null;
    status: string;

    //datas
    dueDate?: Date | null;
    paymentDate?: Date | null;
    paymentLimitDate?: Date | null;

    //valores
    amount: number;
    feeAmount: number | null;
    paymentAmount?: number | null;

    pixQrCode?: string | null;
    pixId?: string | null;

    createdAt: Date;
    updatedAt?: Date | null;
}

export class Pix extends AggregateRoot<PixProps> {
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

    private touch() {
        this.props.updatedAt = new Date();
    }

    set businessId(businessId: UniqueEntityID) {
        this.props.businessId = businessId;
        this.touch();
    }

    set personId(personId: UniqueEntityID | null | undefined) {
        if (personId === undefined && personId === null) {
            return;
        }
        this.props.personId = personId;
        this.touch();
    }

    set documentType(documentType: string) {
        this.props.documentType = documentType;
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

    set feeAmount(feeAmount: number | null) {
        this.props.feeAmount = feeAmount;
        this.touch();
    }

    set paymentAmount(paymentAmount: number | null | undefined) {
        this.props.paymentAmount = paymentAmount;
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

    static create(
        props: Optional<PixProps, 'createdAt'>,
        id?: UniqueEntityID,
    ) {
        const pix = new Pix(
            {
                ...props,
                createdAt: props.createdAt ?? new Date(),

            },
            id,
        );

        return pix;
    }
}