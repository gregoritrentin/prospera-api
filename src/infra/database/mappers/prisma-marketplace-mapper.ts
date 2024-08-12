import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Marketplace } from '@/domain/business/entities/marketplace'
import { Marketplaces as PrismaMarketplace, Prisma } from '@prisma/client'

export class PrismaMarketplaceMapper {
    static toDomain(raw: PrismaMarketplace): Marketplace {
        return Marketplace.create({
            name: raw.name,
            status: raw.status,
            createdAt: raw.createdAt,
            updatedAt: raw.updateAt,
        },
            new UniqueEntityID(raw.id),
        )
    }

    static toPrisma(marketplace: Marketplace): Prisma.MarketplacesUncheckedCreateInput {
        return {
            id: marketplace.id.toString(),
            name: marketplace.name,
            status: marketplace.status,
            createdAt: marketplace.createdAt,
            updateAt: marketplace.updatedAt,
        }
    }
}