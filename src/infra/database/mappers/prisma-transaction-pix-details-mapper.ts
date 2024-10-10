
import { PixDetails } from '@/domain/transaction/entities/value-objects/pix-details'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Prisma } from '@prisma/client';

type PrismaPixDetails = Prisma.TransactionPixGetPayload<{
    include: {
        business: true;
        person: true;
    }
}>

export class PrismaPixDetailsMapper {
    static toDomain(raw: PrismaPixDetails): PixDetails {
        return PixDetails.create({

            businessId: new UniqueEntityID(raw.business.id),
            businessName: raw.business.name,
            personId: raw.person ? new UniqueEntityID(raw.person.id) : undefined,
            personName: raw.person?.name ?? '',
            description: raw.description,
            dueDate: raw.dueDate ?? undefined,
            paymentDate: raw.paymentDate,
            paymentLimitDate: raw.paymentLimitDate,
            amount: raw.amount,
            feeAmount: raw.feeAmount,
            paymentAmount: raw.paymentAmount,
            pixQrCode: raw.pixQrCode,
            pixId: raw.pixId,
            documentType: raw.documentType,
            status: raw.status,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        })
    }
}