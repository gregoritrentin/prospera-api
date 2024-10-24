import { Payment as PrismaPayment, Business as PrismaBusiness, Person as PrismaPerson } from '@prisma/client'
import { PaymentDetails, PaymentType } from '@/domain/payment/entities/value-objects/payment-details'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type PrismaPaymentWithRelations = PrismaPayment & {
    business: PrismaBusiness
    person?: PrismaPerson | null
}

export class PrismaPaymentDetailsMapper {
    static toDomain(raw: PrismaPaymentWithRelations): PaymentDetails {
        return PaymentDetails.create({
            // Business data
            businessId: new UniqueEntityID(raw.business.id),

            // Person data
            personId: raw.person ? new UniqueEntityID(raw.person.id) : null,
            personName: raw.person?.name ?? null,

            // Payment basic data
            paymentId: raw.paymentId,
            paymentType: raw.paymentType as unknown as PaymentType,
            description: raw.description,
            status: raw.status,

            // Valores
            amount: raw.amount,
            feeAmount: raw.feeAmount,
            paymentDate: raw.paymentDate,

            // PIX
            pixMessage: raw.pixMessage,
            pixKey: raw.pixKey,

            // Dados bancários do beneficiário
            beneficiaryIspb: raw.beneficiaryIspb,
            beneficiaryBranch: raw.beneficiaryBranch,
            beneficiaryAccount: raw.beneficiaryAccount,
            beneficiaryAccountType: raw.beneficiaryAccountType,
            beneficiaryName: raw.beneficiaryName,
            beneficiaryDocument: raw.beneficiaryDocument,

            // Optional fields
            barCode: null, // Como não existe no schema do Prisma, setando como null

            // System dates
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        })
    }
}