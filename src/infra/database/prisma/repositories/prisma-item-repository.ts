import { PaginationParams } from "@/core/repositories/pagination-params";
import { Item } from "@/domain/item/entities/item";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaItemMapper } from "../../mappers/prisma-item-mapper";
import { ItemRepository } from "@/domain/item/repositories/item-repository";
import { ItemDetails } from "@/domain/item/entities/value-objects/item-details";
import { PrismaItemDetailsMapper } from "@/infra/database/mappers/prisma-item-details-mapper";

@Injectable()
export class PrismaItemRepository implements ItemRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string, businessId: string): Promise<Item | null> {
        const item = await this.prisma.item.findUnique({
            where: {
                id,
                businessId,
            }
        })

        if (!item) {
            return null
        }
        return PrismaItemMapper.toDomain(item)
    }

    async findMany({ page }: PaginationParams, businessId: string): Promise<Item[]> {

        const item = await this.prisma.item.findMany({
            orderBy: {
                description: 'asc',
            },
            take: 20,

            where: {
                businessId,
            },
            include: {
                business: true

            },
            skip: (page - 1) * 20,
        })

        return item.map(PrismaItemMapper.toDomain)

    }

    async findManyDetails({ page }: PaginationParams, businessId: string): Promise<ItemDetails[]> {

        const item = await this.prisma.item.findMany({
            orderBy: {
                description: 'asc',
            },
            take: 20,

            where: {
                businessId,
            },
            include: {
                business: true
            },

            skip: (page - 1) * 20,
        })

        return item.map(PrismaItemDetailsMapper.toDomain)

    }

    async save(item: Item): Promise<void> {
        const data = PrismaItemMapper.toPrisma(item)

        await this.prisma.item.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

    async create(item: Item): Promise<void> {
        const data = PrismaItemMapper.toPrisma(item)

        await this.prisma.item.create({
            data,
        })
    }

    async delete(item: Item): Promise<void> {
        const data = PrismaItemMapper.toPrisma(item)
        await this.prisma.item.delete({
            where: {
                id: data.id,
            }
        })
    }
}