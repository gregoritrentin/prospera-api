import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Marketplace } from '@/domain/core/entities/marketplace'
import { Marketplaces as PrismaMarketplace, Prisma } from '@prisma/client'

export class PrismaMarketplaceMapper {
    static toDomain(raw: PrismaMarketplace): Marketplace {
        return Marketplace.create({
            name: raw.name,
            document: raw.document,
            status: raw.status,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        },
            new UniqueEntityID(raw.id),
        )
    }

    static toPrisma(marketplace: Marketplace): Prisma.MarketplacesUncheckedCreateInput {
        return {
            id: marketplace.id.toString(),
            name: marketplace.name,
            document: marketplace.document,
            status: marketplace.status,
            createdAt: marketplace.createdAt,
            updatedAt: marketplace.updatedAt,
        }
    }
}