import { Email as PrismaEmail, Prisma } from '@prisma/client'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Email } from '@/domain/email/entities/email'

export class PrismaEmailMapper {
    static toDomain(raw: PrismaEmail): Email {
        return Email.create(
            {
                businessId: raw.businessId ? new UniqueEntityID(raw.businessId) : undefined,
                to: raw.to,
                subject: raw.subject,
                body: raw.body,
                status: raw.status,
            },
            new UniqueEntityID(raw.id),
        )
    }

    static toPrisma(email: Email): Prisma.EmailUncheckedCreateInput {
        return {
            id: email.id.toString(),
            businessId: email.businessId?.toString() || undefined,
            to: email.to,
            body: email.body,
            subject: email.subject,
            status: email.status,

        }
    }
}



