import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Boleto } from '@/domain/transaction/entities/boleto'
import { TransactionBoleto as PrismaTransactionBoleto, Prisma } from '@prisma/client'

export class PrismaTransactionBoletoMapper {
    static toDomain(raw: PrismaTransactionBoleto): Boleto {
        return Boleto.create(
            {
                businessId: new UniqueEntityID(raw.businessId),
                personId: new UniqueEntityID(raw.personId),
                documentType: raw.documentType,
                ourNumber: raw.ourNumber,
                description: raw.description,
                status: raw.status,
                dueDate: raw.dueDate,
                paymentDate: raw.paymentDate,
                paymentLimitDate: raw.paymentLimitDate,
                amount: raw.amount,
                feeAmount: raw.feeAmount,
                paymentAmount: raw.paymentAmount,
                digitableLine: raw.digitableLine,
                barcode: raw.barcode,
                pixQrCode: raw.pixQrCode,
                pixId: raw.pixId,
                pdfFileId: raw.pdfFileId,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt
            },
            new UniqueEntityID(raw.id)
        )
    }

    static toPrisma(boleto: Boleto): Prisma.TransactionBoletoUncheckedCreateInput {
        return {
            id: boleto.id.toString(),
            businessId: boleto.businessId.toString(),
            personId: boleto.personId.toString(),
            documentType: boleto.documentType,
            ourNumber: boleto.ourNumber,
            description: boleto.description,
            status: boleto.status,
            dueDate: boleto.dueDate,
            paymentDate: boleto.paymentDate,
            paymentLimitDate: boleto.paymentLimitDate,
            amount: boleto.amount,
            feeAmount: boleto.feeAmount ?? 0,
            paymentAmount: boleto.paymentAmount,
            digitableLine: boleto.digitableLine,
            barcode: boleto.barcode,
            pixQrCode: boleto.pixQrCode,
            pixId: boleto.pixId,
            pdfFileId: boleto.pdfFileId,
            createdAt: boleto.createdAt,
            updatedAt: boleto.updatedAt
        }
    }
}