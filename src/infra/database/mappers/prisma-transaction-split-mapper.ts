// src/infra/database/prisma/mappers/prisma-transaction-split-mapper.ts
import { Prisma, SplitType as PrismaSplitType } from '@prisma/client';
import { SplitType as DomainSplitType } from '@/core/types/enums';
import { TransactionSplit } from '@/domain/transaction/entities/transaction-split';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export class PrismaTransactionSplitMapper {
    static toPrisma(transactionSplit: TransactionSplit): Prisma.TransactionSplitUncheckedCreateInput {
        return {
            id: transactionSplit.id.toString(),
            transactionId: transactionSplit.transactionId.toString(),
            recipientId: transactionSplit.recipientId.toString(),
            splitType: this.mapSplitTypeToPrisma(transactionSplit.splitType),
            amount: transactionSplit.amount,
        }
    }

    private static mapSplitTypeToPrisma(domainType: DomainSplitType): PrismaSplitType {
        switch (domainType) {
            case DomainSplitType.FIXED:
                return PrismaSplitType.VALUE;
            case DomainSplitType.PERCENT:
                return PrismaSplitType.PERCENT;
            default:
                throw new Error(`Tipo de split inválido: ${domainType}`);
        }
    }

    static toDomain(raw: any): TransactionSplit {
        return TransactionSplit.create(
            {
                transactionId: new UniqueEntityID(raw.transactionId),
                recipientId: new UniqueEntityID(raw.recipientId),
                splitType: this.mapSplitTypeToDomain(raw.splitType),
                amount: raw.amount
            },
            new UniqueEntityID(raw.id)
        );
    }

    private static mapSplitTypeToDomain(prismaType: PrismaSplitType): DomainSplitType {
        switch (prismaType) {
            case PrismaSplitType.VALUE:
                return DomainSplitType.FIXED;
            case PrismaSplitType.PERCENT:
                return DomainSplitType.PERCENT;
            default:
                throw new Error(`Tipo de split inválido: ${prismaType}`);
        }
    }
}