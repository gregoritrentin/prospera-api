import { UniqueEntityID } from '@core/domain/entity/unique-entity-id'
import { Account } from '@/domain/account/entities/account'
import { Account as PrismaAccount, Prisma } from '@prisma/client'

export class PrismaAccountMapper {
    static toDomain(raw: PrismaAccount): Account {
        return Account.create({
            businessId: new UniqueEntityID(raw.businessId),
            number: raw.number,
            status: raw.status,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(account: Account): Prisma.AccountUncheckedCreateInput {
        return {
            id: account.id.toString(),
            businessId: account.businessId.toString(),
            number: account.number,
            status: account.status,
            createdAt: account.createdAt,
            updatedAt: account.updatedAt
        }
    }
}