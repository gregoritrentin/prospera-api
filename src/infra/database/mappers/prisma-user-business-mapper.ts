import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserBusiness } from '@/domain/user/entities/user-business'
import { UserBusiness as PrismaUserBusiness, Prisma } from '@prisma/client'

export class PrismaUserBusinessMapper {
    static toDomain(raw: PrismaUserBusiness): UserBusiness {
        return UserBusiness.create({
            businessId: new UniqueEntityID(raw.businessId),
            userId: new UniqueEntityID(raw.userId),
            role: raw.role,
            status: raw.status,
            createdAt: raw.createdAt,
            updatedAt: raw.updateAt,
        },
            new UniqueEntityID(raw.id),
        )
    }

    static toPrisma(userBusiness: UserBusiness): Prisma.UserBusinessUncheckedCreateInput {
        return {
            id: userBusiness.id.toString(),
            businessId: userBusiness.businessId.toString(),
            userId: userBusiness.userId.toString(),
            role: userBusiness.role,
            status: userBusiness.status,
            createdAt: userBusiness.createdAt,
            updateAt: userBusiness.updatedAt,
        }
    }
}
