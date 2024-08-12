import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { App as PrismaApp, Prisma } from '@prisma/client'
import { App } from '@/domain/app/entities/app'

export class PrismaAppMapper {
    static toDomain(raw: PrismaApp): App {
        return App.create({
            name: raw.name,
            description: raw.description,
            price: raw.price,
            status: raw.status,
            createdAt: raw.createdAt,
            updatedAt: raw.updateAt,
        },
            new UniqueEntityID(raw.id),
        )
    }

    static toPrisma(app: App): Prisma.AppUncheckedCreateInput {
        return {
            id: app.id.toString(),
            name: app.name,
            description: app.description,
            price: app.price,
            status: app.status,
            createdAt: app.createdAt,
            updateAt: app.updatedAt,
        }
    }
}