// repositories/prisma/prisma-receivable-mapper.ts
import { Receivable as PrismaReceivable } from '@prisma/client'
import { Receivable } from '@/domain/transaction/entities/receivable'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaReceivableMapper {
    static toPrisma(receivable: Receivable) {
        return {
            id: receivable.id.toString(),
            transactionId: receivable.transactionId.toString(),
            originalOwnerId: receivable.originalOwnerId.toString(),
            currentOwnerId: receivable.currentOwnerId.toString(),
            amount: receivable.amount,
            netAmount: receivable.netAmount,
            originalDueDate: receivable.originalDueDate,
            currentDueDate: receivable.currentDueDate,
            status: receivable.status as any,
            businessId: receivable.businessId?.toString(),
            createdAt: receivable.createdAt,
            updatedAt: receivable.updatedAt,
        }
    }

    static toDomain(raw: PrismaReceivable): Receivable {
        return Receivable.create(
            {
                transactionId: new UniqueEntityID(raw.transactionId),
                originalOwnerId: new UniqueEntityID(raw.originalOwnerId),
                currentOwnerId: new UniqueEntityID(raw.currentOwnerId),
                amount: raw.amount,
                netAmount: raw.netAmount,
                originalDueDate: raw.originalDueDate,
                currentDueDate: raw.currentDueDate,
                status: raw.status as any,
                businessId: raw.businessId ? new UniqueEntityID(raw.businessId) : undefined,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new UniqueEntityID(raw.id),
        )
    }
}