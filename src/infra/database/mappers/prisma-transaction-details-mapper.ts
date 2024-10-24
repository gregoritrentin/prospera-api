import { Transaction as PrismaTransaction, Business as PrismaBusiness, Person as PrismaPerson, File as PrismaFile } from '@prisma/client'
import { TransactionDetails, TransactionType } from '@/domain/transaction/entities/value-objects/transaction-details'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type PrismaTransactionWithRelations = PrismaTransaction & {
    business: PrismaBusiness
    person?: PrismaPerson | null
    file?: PrismaFile | null
}

export class PrismaTransactionDetailsMapper {
    static toDomain(raw: PrismaTransactionWithRelations): TransactionDetails {
        return TransactionDetails.create({
            // Business data
            businessId: new UniqueEntityID(raw.business.id),
            businessName: raw.business.name,

            // Person data
            personId: raw.person ? new UniqueEntityID(raw.person.id) : null,
            personName: raw.person?.name ?? null,

            // Transaction basic data
            description: raw.description,
            status: raw.status,
            type: raw.type as TransactionType,

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

            // System dates
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        })
    }
}