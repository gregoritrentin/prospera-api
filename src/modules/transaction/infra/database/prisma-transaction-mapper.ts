import { UniqueEntityID } from '@core/domain/entity/unique-entity-id'
import { Transaction, TransactionType } from '@/domain/transaction/entities/transaction'
import { Transaction as PrismaTransaction, Prisma } from '@prisma/client'

export class PrismaTransactionMapper {
    static toDomain(raw: PrismaTransaction): Transaction {
        return Transaction.create({
            businessId: new UniqueEntityID(raw.businessId),
            personId: raw.personId ? new UniqueEntityID(raw.personId) : null,
            description: raw.description,
            status: raw.status,
            type: raw.type as unknown as TransactionType,
            // Datas
            dueDate: raw.dueDate,
            paymentDate: raw.paymentDate,
            paymentLimitDate: raw.paymentLimitDate,
            // Valores
            amount: raw.amount,
            feeAmount: raw.feeAmount,
            paymentAmount: raw.paymentAmount,
            // Boleto
            ourNumber: raw.ourNumber,
            digitableLine: raw.digitableLine,
            barcode: raw.barcode,
            // PIX
            pixQrCode: raw.pixQrCode,
            pixId: raw.pixId,
            fileId: raw.fileId,
            // Datas do sistema
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(transaction: Transaction): Prisma.TransactionUncheckedCreateInput {
        return {
            id: transaction.id.toString(),
            businessId: transaction.businessId.toString(),
            personId: transaction.personId?.toString(),
            description: transaction.description,
            status: transaction.status,
            type: transaction.type,
            // Datas
            dueDate: transaction.dueDate,
            paymentDate: transaction.paymentDate,
            paymentLimitDate: transaction.paymentLimitDate,
            // Valores
            amount: transaction.amount,
            feeAmount: transaction.feeAmount,
            paymentAmount: transaction.paymentAmount,
            // Boleto
            ourNumber: transaction.ourNumber,
            digitableLine: transaction.digitableLine,
            barcode: transaction.barcode,
            // PIX
            pixQrCode: transaction.pixQrCode,
            pixId: transaction.pixId,
            fileId: transaction.fileId,
            // Datas do sistema
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt
        }
    }
}