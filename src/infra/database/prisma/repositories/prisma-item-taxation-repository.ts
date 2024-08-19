import { PaginationParams } from "@/core/repositories/pagination-params";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ItemTaxationRepository } from "@/domain/item/repositories/item-taxation-repository";
import { ItemTaxation } from "@/domain/item/entities/item-taxation";
import { PrismaItemTaxationMapper } from "@/infra/database/mappers/prisma-item-taxation-mapper";

@Injectable()
export class PrismaItemTaxationRepository implements ItemTaxationRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string, businessId: string): Promise<ItemTaxation | null> {
        const itemTaxation = await this.prisma.itemTaxation.findUnique({
            where: {
                id,
                businessId,
            }
        })

        if (!itemTaxation) {
            return null
        }
        return PrismaItemTaxationMapper.toDomain(itemTaxation)
    }

    async findMany({ page }: PaginationParams, businessId: string): Promise<ItemTaxation[]> {

        const itemTaxation = await this.prisma.itemTaxation.findMany({
            orderBy: {
                taxation: 'asc',
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

        return itemTaxation.map(PrismaItemTaxationMapper.toDomain)

    }

    async save(itemTaxation: ItemTaxation): Promise<void> {
        const data = PrismaItemTaxationMapper.toPrisma(itemTaxation)

        await this.prisma.itemTaxation.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

    async create(itemTaxation: ItemTaxation): Promise<void> {
        const data = PrismaItemTaxationMapper.toPrisma(itemTaxation)

        await this.prisma.itemTaxation.create({
            data,
        })
    }

    async delete(itemTaxation: ItemTaxation): Promise<void> {
        const data = PrismaItemTaxationMapper.toPrisma(itemTaxation)
        await this.prisma.itemTaxation.delete({
            where: {
                id: data.id,
            }
        })
    }
}