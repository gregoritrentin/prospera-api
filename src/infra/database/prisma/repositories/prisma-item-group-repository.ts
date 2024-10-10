import { PaginationParams } from "@/core/repositories/pagination-params";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ItemGroupRepository } from "@/domain/item/repositories/item-group-repository";
import { ItemGroup } from "@/domain/item/entities/item-group";
import { PrismaItemGroupMapper } from "@/infra/database/mappers/prisma-item-group-mapper";

@Injectable()
export class PrismaItemGroupRepository implements ItemGroupRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string, businessId: string): Promise<ItemGroup | null> {
        const itemGroup = await this.prisma.itemGroup.findUnique({
            where: {
                id,
                businessId,
            }
        })

        if (!itemGroup) {
            return null
        }
        return PrismaItemGroupMapper.toDomain(itemGroup)
    }

    async findMany({ page }: PaginationParams, businessId: string): Promise<ItemGroup[]> {

        const itemGroup = await this.prisma.itemGroup.findMany({
            orderBy: {
                group: 'asc',
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

        return itemGroup.map(PrismaItemGroupMapper.toDomain)

    }

    async save(itemGroup: ItemGroup): Promise<void> {
        const data = PrismaItemGroupMapper.toPrisma(itemGroup)

        await this.prisma.itemGroup.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

    async create(itemGroup: ItemGroup): Promise<void> {
        const data = PrismaItemGroupMapper.toPrisma(itemGroup)

        await this.prisma.itemGroup.create({
            data,
        })
    }

    async delete(itemGroup: ItemGroup): Promise<void> {
        const data = PrismaItemGroupMapper.toPrisma(itemGroup)
        await this.prisma.itemGroup.delete({
            where: {
                id: data.id,
            }
        })
    }
}