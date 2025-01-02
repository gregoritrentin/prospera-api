import { PaginationParams } from "@/core/domain/repository/pagination-params"
import { Sale } from "@/modules/sale/domain/entities/sale"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { SalesRepository } from "@/modules/sale/domain/repositories/sales-repository"
import { SaleDetails } from "@/modules/sale/domain/entities/value-objects/sale-details"
import { PrismaSaleDetailsMapper } from "@/core/infra/database/mappers/prisma-sale-details-mapper"
import { PrismaSaleMapper } from 'prisma-sale-mapper.mapper'

@Injectable()
export class PrismaSalesRepository implements SalesRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string, businessId: string): Promise<Sale | null> {
        const sale = await this.prisma.sale.findUnique({
            where: {
                id,
                businessId,
            },
            include: {
                saleItem: true,
            }
        })

        if (!sale) {
            return null
        }
        return PrismaSaleMapper.toDomain(sale)
    }

    async findMany({ page }: PaginationParams, businessId: string): Promise<Sale[]> {
        const sales = await this.prisma.sale.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            where: {
                businessId,
            },
            skip: (page - 1) * 20,
        })

        return sales.map(PrismaSaleMapper.toDomain)
    }

    async findManyDetails({ page }: PaginationParams, businessId: string): Promise<SaleDetails[]> {
        const sales = await this.prisma.sale.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            where: {
                businessId,
            },
            include: {
                business: true,
                customer: true,
                owner: true,
                salesPerson: true,
                salesChannel: true,

            },
            skip: (page - 1) * 20,
        })

        return sales.map(PrismaSaleDetailsMapper.toDomain)
    }

    async save(sale: Sale): Promise<void> {
        const data = PrismaSaleMapper.toPrisma(sale)

        await this.prisma.sale.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

    async create(sale: Sale): Promise<void> {
        const data = PrismaSaleMapper.toPrisma(sale)

        await this.prisma.sale.create({
            data,
        })
    }

    async delete(sale: Sale): Promise<void> {
        const data = PrismaSaleMapper.toPrisma(sale)
        await this.prisma.sale.delete({
            where: {
                id: data.id,
            }
        })
    }
}