import { UniqueEntityID } from '@core/domain/entity/unique-entity-id';
import { Payment, PaymentType } from '@/domain/payment/entities/payment';
import { Payment as PrismaPayment, Prisma } from '@prisma/client';

export class PrismaPaymentMapper {
    static toDomain(raw: PrismaPayment): Payment {
        return Payment.create(
            {
                businessId: new UniqueEntityID(raw.businessId),
                personId: raw.personId ? new UniqueEntityID(raw.personId) : undefined,
                paymentId: raw.paymentId,
                accountId: raw.accountId,
                paymentType: raw.paymentType as PaymentType,
                description: raw.description,
                status: raw.status,
                amount: raw.amount,
                feeAmount: raw.feeAmount,
                paymentDate: raw.paymentDate,
                pixMessage: raw.pixMessage,
                pixKey: raw.pixKey,
                beneficiaryIspb: raw.beneficiaryIspb,
                beneficiaryBranch: raw.beneficiaryBranch,
                beneficiaryAccount: raw.beneficiaryAccount,
                beneficiaryAccountType: raw.beneficiaryAccountType,
                beneficiaryName: raw.beneficiaryName,
                beneficiaryDocument: raw.beneficiaryDocument,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt
            },
            new UniqueEntityID(raw.id)
        );
    }

    static toPrisma(payment: Payment): Prisma.PaymentUncheckedCreateInput {

        console.log(payment)
        return {
            id: payment.id.toString(),
            businessId: payment.businessId.toString(),
            personId: payment.personId?.toString() ?? undefined,
            paymentId: payment.paymentId ?? undefined,
            accountId: payment.accountId,
            paymentType: payment.paymentType,
            description: payment.description,
            status: payment.status,
            amount: payment.amount,
            feeAmount: payment.feeAmount,
            paymentDate: payment.paymentDate,
            pixMessage: payment.pixMessage,
            pixKey: payment.pixKey,
            beneficiaryIspb: payment.beneficiaryIspb,
            beneficiaryBranch: payment.beneficiaryBranch,
            beneficiaryAccount: payment.beneficiaryAccount,
            beneficiaryAccountType: payment.beneficiaryAccountType,
            beneficiaryName: payment.beneficiaryName,
            beneficiaryDocument: payment.beneficiaryDocument,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt
        };
    }
}