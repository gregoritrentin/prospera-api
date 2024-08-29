import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { BusinessApp } from '@/domain/core/entities/business-app'
import { BusinessApps as PrismaBusinessApp, Prisma } from '@prisma/client'

export class PrismaBusinessAppMapper {
    static toDomain(raw: PrismaBusinessApp): BusinessApp {
        return BusinessApp.create({
            businessId: new UniqueEntityID(raw.businessId),
            appId: new UniqueEntityID(raw.appId),
            price: raw.price,
            quantity: raw.quantity,
            status: raw.status,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        },
            new UniqueEntityID(raw.id),
        )
    }

    static toPrisma(businessApp: BusinessApp): Prisma.BusinessAppsUncheckedCreateInput {
        return {
            id: businessApp.id.toString(),
            businessId: businessApp.businessId.toString(),
            appId: businessApp.appId.toString(),
            price: businessApp.price,
            quantity: businessApp.quantity,
            status: businessApp.status,
            createdAt: businessApp.createdAt,
            updatedAt: businessApp.updatedAt,
        }
    }
}