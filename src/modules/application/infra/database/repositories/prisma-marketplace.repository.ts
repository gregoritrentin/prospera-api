import { PaginationParams } from "@/core/repositories/pagination-params"
import { MarketplaceRepository } from "@/modules/application/domain/repositories/marketplace-repository"
import { Marketplace } from "@/modules/application/domain/entities/marketplace"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { PrismaMarketplaceMapper } from "@/modules/mappers/prisma-marketplace-mapper"

@Injectable()
export class PrismaMarketplaceRepository implements MarketplaceRepository {
    constructor(private prisma: PrismaService) { }
    async findById(id: string): Promise<Marketplace | null> {
        const marketplace = await this.prisma.marketplaces.findUnique({
            where: {
                id,
            }
        })

        if (!marketplace) {
            return null
        }
        return PrismaMarketplaceMapper.toDomain(marketplace)
    }

    async findMany({ page }: PaginationParams): Promise<Marketplace[]> {
        const marketplace = await this.prisma.marketplaces.findMany({
            orderBy: {
                name: 'asc',
            },
            take: 20,
            skip: (page - 1) * 20,
        })

        return marketplace.map(PrismaMarketplaceMapper.toDomain)


    }

    async save(marketplace: Marketplace): Promise<void> {
        const data = PrismaMarketplaceMapper.toPrisma(marketplace)

        await this.prisma.marketplaces.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

    async create(marketplace: Marketplace): Promise<void> {
        const data = PrismaMarketplaceMapper.toPrisma(marketplace)

        await this.prisma.marketplaces.create({
            data,
        })
    }

    async delete(marketplace: Marketplace): Promise<void> {
        const data = PrismaMarketplaceMapper.toPrisma(marketplace)
        await this.prisma.marketplaces.delete({
            where: {
                id: data.id,
            }
        })
    }
}