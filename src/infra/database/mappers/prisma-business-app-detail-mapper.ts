import { BusinessApps as PrismaBusinessApp, App as PrismaApp } from '@prisma/client'
import { BusinessAppDetails } from '@/domain/core/entities/value-objects/business-app-details'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

type PrismaBusinessAppDetails = PrismaBusinessApp & {
    apps: PrismaApp
}

export class PrismaBusinessAppDetailsMapper {
    static toDomain(raw: PrismaBusinessAppDetails): BusinessAppDetails {
        return BusinessAppDetails.create({

            businessId: new UniqueEntityID(raw.businessId),
            appId: new UniqueEntityID(raw.appId),
            appName: raw.apps.name,
            price: raw.price,
            quantity: raw.quantity,
            status: raw.status,
            createdAt: raw.createdAt,
            updatedAt: raw.updateAt,
        })
    }
}