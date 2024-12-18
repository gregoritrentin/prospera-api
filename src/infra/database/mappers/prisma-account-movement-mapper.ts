import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AccountMovement } from '@/domain/account/entities/account-movement'
import { AccountMovement as PrismaAccountMovement, Prisma } from '@prisma/client'
import { MovementType } from '@/core/types/enums'

export class PrismaAccountMovementMapper {
    static toDomain(raw: PrismaAccountMovement): AccountMovement {
        return AccountMovement.create({
            type: raw.type as MovementType,
            amount: raw.amount,
            description: raw.description,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            accountId: new UniqueEntityID(raw.accountId)
        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(accountMovement: AccountMovement): Prisma.AccountMovementUncheckedCreateInput {
        return {
            id: accountMovement.id.toString(),
            accountId: accountMovement.accountId.toString(),
            type: accountMovement.type,
            amount: accountMovement.amount,
            description: accountMovement.description,
            createdAt: accountMovement.createdAt,
            updatedAt: accountMovement.updatedAt
        }
    }
}