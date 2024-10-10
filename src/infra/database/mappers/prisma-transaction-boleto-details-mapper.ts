
import { BoletoDetails } from '@/domain/transaction/entities/value-objects/boleto-details'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Prisma } from '@prisma/client';

type PrismaBoletoDetails = Prisma.TransactionBoletoGetPayload<{
    include: {
        business: true;
        person: true;
        pdfFile: true;
    }
}>

export class PrismaBoletoDetailsMapper {
    static toDomain(raw: PrismaBoletoDetails): BoletoDetails {
        return BoletoDetails.create({

            businessId: new UniqueEntityID(raw.business.id),
            businessName: raw.business.name,
            personId: new UniqueEntityID(raw.personId),
            personName: raw.person.name,
            description: raw.description,
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
            pdfFileId: raw.pdfFileId ? new UniqueEntityID(raw.pdfFile?.id) : undefined,
            pdfFileUrl: raw.pdfFile?.url,
            documentType: raw.documentType,
            status: raw.status,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        })
    }
}