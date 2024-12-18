import { PaginationParams } from "@/core/repositories/pagination-params";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { ReceivableRepository } from "@/domain/transaction/repositories/receivable-repository";
import { Receivable } from "@/domain/transaction/entities/receivable";
import { PrismaReceivableMapper } from "@/infra/database/mappers/prisma-receivable-mapper";

@Injectable()
export class PrismaReceivableRepository implements ReceivableRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string, businessId: string): Promise<Receivable | null> {
        const receivable = await this.prisma.receivable.findUnique({
            where: {
                id,
                businessId,
            },
        })

        if (!receivable) {
            return null
        }

        return PrismaReceivableMapper.toDomain(receivable)
    }

    async findMany({ page }: PaginationParams, businessId: string): Promise<Receivable[]> {
        const receivables = await this.prisma.receivable.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            where: {
                businessId,
            },
            skip: (page - 1) * 20,
        })

        return receivables.map(PrismaReceivableMapper.toDomain)
    }

    async findByTransactionId(transactionId: string, businessId: string): Promise<Receivable | null> {
        const receivable = await this.prisma.receivable.findFirst({
            where: {
                transactionId,
                businessId,
            },
        })

        if (!receivable) {
            return null
        }

        return PrismaReceivableMapper.toDomain(receivable)
    }

    async save(receivable: Receivable): Promise<void> {
        const data = PrismaReceivableMapper.toPrisma(receivable)

        await this.prisma.receivable.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

    async create(receivable: Receivable): Promise<void> {
        const data = PrismaReceivableMapper.toPrisma(receivable)

        await this.prisma.receivable.create({
            data,
        })
    }

}