import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { TransactionSplitRepository } from '@/domain/transaction/repositories/transaction-split-repository'
import { TransactionSplit } from '@/domain/transaction/entities/transaction-split'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PrismaTransactionSplitMapper } from '@/infra/database/mappers/prisma-transaction-split-mapper'
import { Prisma } from '@prisma/client'

@Injectable()
export class PrismaTransactionSplitRepository implements TransactionSplitRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string, businessId: string): Promise<TransactionSplit | null> {
        const transactionSplit = await this.prisma.transactionSplit.findUnique({
            where: {
                id,
                transaction: {
                    businessId
                }
            },
        })

        if (!transactionSplit) {
            return null
        }

        return PrismaTransactionSplitMapper.toDomain(transactionSplit)
    }

    async findByTransactionId(transactionId: string, businessId: string): Promise<TransactionSplit | null> {
        const transactionSplit = await this.prisma.transactionSplit.findFirst({
            where: {
                transactionId,
                transaction: {
                    businessId
                }
            },
        })

        if (!transactionSplit) {
            return null
        }

        return PrismaTransactionSplitMapper.toDomain(transactionSplit)
    }

    async findMany({ page }: PaginationParams, businessId: string): Promise<TransactionSplit[]> {
        const transactionSplits = await this.prisma.transactionSplit.findMany({
            where: {
                transaction: {
                    businessId
                }
            },
            take: 20,
            skip: (page - 1) * 20,
            orderBy: {
                transaction: {
                    createdAt: 'desc'
                }
            },
        })

        return transactionSplits.map(split => PrismaTransactionSplitMapper.toDomain(split))
    }

    async create(transactionSplit: TransactionSplit): Promise<void> {
        const data = PrismaTransactionSplitMapper.toPrisma(transactionSplit)

        try {
            await this.prisma.transactionSplit.create({
                data: data as Prisma.TransactionSplitUncheckedCreateInput,
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            throw new Error(`Erro ao criar TransactionSplit: ${errorMessage}`)
        }
    }

    async save(transactionSplit: TransactionSplit): Promise<void> {
        const data = PrismaTransactionSplitMapper.toPrisma(transactionSplit)

        try {
            await this.prisma.transactionSplit.update({
                where: {
                    id: data.id,
                },
                data: data as Prisma.TransactionSplitUncheckedUpdateInput,
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            throw new Error(`Erro ao atualizar TransactionSplit: ${errorMessage}`)
        }
    }

    async delete(transactionSplit: TransactionSplit): Promise<void> {
        try {
            await this.prisma.transactionSplit.delete({
                where: {
                    id: transactionSplit.id.toString(),
                },
            })
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            throw new Error(`Erro ao deletar TransactionSplit: ${errorMessage}`)
        }
    }
}