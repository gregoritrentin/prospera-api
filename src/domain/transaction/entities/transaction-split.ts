import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CalculationMode, SplitType } from '@/core/types/enums';

export interface TransactionSplitProps {
    transactionId: UniqueEntityID;
    recipientId: UniqueEntityID;
    splitType: SplitType;
    amount: number;
}

export class TransactionSplit extends AggregateRoot<TransactionSplitProps> {
    get transactionId() {
        return this.props.transactionId
    }

    get recipientId() {
        return this.props.recipientId
    }

    get splitType() {
        return this.props.splitType
    }

    get amount() {
        return this.props.amount
    }

    private touch() {
        // Se precisarmos adicionar updatedAt posteriormente
    }

    set amount(amount: number) {
        this.props.amount = amount
        this.touch()
    }

    set splitType(splitType: SplitType) {
        this.props.splitType = splitType
        this.touch()
    }

    static create(
        props: TransactionSplitProps,
        id?: UniqueEntityID,
    ) {
        const transactionSplit = new TransactionSplit(props, id)

        return transactionSplit
    }

}