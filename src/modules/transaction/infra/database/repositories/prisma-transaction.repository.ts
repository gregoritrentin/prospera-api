import { PaginationParams } from "@/core/domain/repository/pagination-params"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { Transaction } from "@/modules/transaction/domain/entities/transaction"
import { TransactionDetails } from "@/modules/transaction/domain/entities/value-objects/transaction-details"
import { TransactionRepository } from "@/modules/transaction/domain/repositories/transaction-repository"
import { PrismaTransactionMapper } from 'prisma-transaction-mapper.mapper'
import { PrismaTransactionDetailsMapper } from "@/core/infra/database/mappers/prisma-transaction-details-mapper"

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string, businessId: string): Promise<Transaction | null> {
        const transaction = await this.prisma.transaction.findUnique({
            where: {
                id,
                businessId,
            }
        })

        if (!transaction) {
            return null
        }

        return PrismaTransactionMapper.toDomain(transaction)
    }

    async findByIdDetails(id: string, businessId: string): Promise<TransactionDetails | null> {
        const transaction = await this.prisma.transaction.findUnique({
            where: {
                id,
                businessId,
            },
            include: {
                business: true,
                person: true,
                file: true,

            },
        })

        if (!transaction) {
            return null
        }

        return PrismaTransactionDetailsMapper.toDomain(transaction)
    }

    async findMany({ page }: PaginationParams, businessId: string): Promise<Transaction[]> {
        const transactions = await this.prisma.transaction.findMany({
            orderBy: {
                createdAt: 'desc', // Ordenando por data de criação, mais recentes primeiro
            },
            take: 20,
            where: {
                businessId,
            },
            skip: (page - 1) * 20,
        })

        return transactions.map(PrismaTransactionMapper.toDomain)
    }

    async findManyDetails({ page }: PaginationParams, businessId: string): Promise<TransactionDetails[]> {
        const transactions = await this.prisma.transaction.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            where: {
                businessId,
            },
            include: {
                business: true,
                person: true,
                file: true,

            },
            skip: (page - 1) * 20,
        })

        return transactions.map(PrismaTransactionDetailsMapper.toDomain)
    }

    async create(transaction: Transaction): Promise<void> {
        const data = PrismaTransactionMapper.toPrisma(transaction)

        await this.prisma.transaction.create({
            data,
        })
    }

    async save(transaction: Transaction): Promise<void> {
        const data = PrismaTransactionMapper.toPrisma(transaction)

        await this.prisma.transaction.update({
            where: {
                id: data.id,
            },
            data,
        })
    }




}