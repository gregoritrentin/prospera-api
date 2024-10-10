import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Pix } from '@/domain/transaction/entities/pix'
import { TransactionPix as PrismaTransactionPix, Prisma } from '@prisma/client'

export class PrismaTransactionPixMapper {
    static toDomain(raw: PrismaTransactionPix): Pix {
        return Pix.create(
            {
                businessId: new UniqueEntityID(raw.businessId),
                personId: new UniqueEntityID(raw.personId ?? undefined),
                documentType: raw.documentType,
                description: raw.description,
                status: raw.status,
                dueDate: raw.dueDate,
                paymentDate: raw.paymentDate,
                paymentLimitDate: raw.paymentLimitDate,
                amount: raw.amount,
                feeAmount: raw.feeAmount,
                paymentAmount: raw.paymentAmount,
                pixId: raw.pixId,
                pixQrCode: raw.pixQrCode,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt
            },
            new UniqueEntityID(raw.id)
        )
    }

    static toPrisma(pix: Pix): Prisma.TransactionPixUncheckedCreateInput {
        return {
            id: pix.id.toString(),
            businessId: pix.businessId.toString(),
            personId: pix.personId?.toString() ?? undefined,
            documentType: pix.documentType,
            description: pix.description,
            status: pix.status,
            dueDate: pix.dueDate,
            paymentDate: pix.paymentDate,
            paymentLimitDate: pix.paymentLimitDate,
            amount: pix.amount,
            feeAmount: pix.feeAmount ?? 0,
            paymentAmount: pix.paymentAmount,
            pixId: pix.pixId,
            pixQrCode: pix.pixQrCode,
            createdAt: pix.createdAt,
            updatedAt: pix.updatedAt
        }
    }
}