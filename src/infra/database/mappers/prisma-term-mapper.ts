import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Term } from '@/domain/core/entities/term'
import { Terms as PrismaTerm, Prisma } from '@prisma/client'

export class PrismaTermMapper {
    static toDomain(raw: PrismaTerm): Term {
        return Term.create({
            title: raw.title,
            content: raw.content,
            language: raw.language,
            startAt: raw.startAt,
            createdAt: raw.createdAt,
            updatedAt: raw.updateAt,
        },
            new UniqueEntityID(raw.id),
        )
    }

    static toPrisma(businessApp: Term): Prisma.TermsUncheckedCreateInput {
        return {
            id: businessApp.id.toString(),
            title: businessApp.title,
            content: businessApp.content,
            language: businessApp.language,
            startAt: businessApp.startAt,
            createdAt: businessApp.createdAt,
            updateAt: businessApp.updatedAt,
        }
    }
}