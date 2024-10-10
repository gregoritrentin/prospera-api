import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { UserBusinessDetails } from '@/domain/application/entities/value-objects/user-business-details'
import { User as PrismaUser, Business as PrismaBusiness, UserBusiness as PrismaUserBusiness, Prisma } from '@prisma/client'

type PrismaUserDetailsBusiness = PrismaUserBusiness & {
    business: PrismaBusiness
    user: PrismaUser
}

export class PrismaUserBusinessDetailsMapper {
    static toDomain(raw: PrismaUserDetailsBusiness): UserBusinessDetails {
        return UserBusinessDetails.create({

            businessId: new UniqueEntityID(raw.businessId),
            businessName: raw.business.name,
            userId: new UniqueEntityID(raw.userId),
            userName: raw.user.name,
            role: raw.role,
            status: raw.status,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        },

        )
    }
}
