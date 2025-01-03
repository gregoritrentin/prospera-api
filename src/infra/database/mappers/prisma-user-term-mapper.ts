import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserTerm } from '@/domain/application/entities/user-term'
import { UserTerms as PrismaUserTerm, Prisma } from '@prisma/client'

export class PrismaUserTermMapper {
    static toDomain(raw: PrismaUserTerm): UserTerm {
        return UserTerm.create({
            termId: new UniqueEntityID(raw.termId),
            userId: new UniqueEntityID(raw.userId),
            ip: raw.ipAddress,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        },
            new UniqueEntityID(raw.id),
        )
    }

    static toPrisma(userTerm: UserTerm): Prisma.UserTermsUncheckedCreateInput {
        return {
            id: userTerm.id.toString(),
            termId: userTerm.termId.toString(),
            userId: userTerm.userId.toString(),
            ipAddress: userTerm.ip,
            createdAt: userTerm.createdAt,
            updatedAt: userTerm.updatedAt,
        }
    }
}