import { PaginationParams } from "@/core/repositories/pagination-params";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { AccountMovement } from "@/domain/account/entities/account-movement";
import { AccountMovementsRepository } from "@/domain/account/repositories/account-movement-repository";
import { PrismaAccountMovementMapper } from "../../mappers/prisma-account-movement-mapper";

@Injectable()
export class PrismaAccountMovementsRepository implements AccountMovementsRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<AccountMovement | null> {
        const accountMovement = await this.prisma.accountMovement.findUnique({
            where: {
                id,
            }
        })

        if (!accountMovement) {
            return null
        }

        return PrismaAccountMovementMapper.toDomain(accountMovement)
    }

    async findMany(
        { page }: PaginationParams,
        accountId: string
    ): Promise<AccountMovement[]> {
        const accountMovements = await this.prisma.accountMovement.findMany({
            where: {
                accountId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            skip: (page - 1) * 20,
        })

        return accountMovements.map(PrismaAccountMovementMapper.toDomain)
    }

    async findManyByAccountId(
        accountId: string,
        orderBy: 'asc' | 'desc' = 'desc'
    ): Promise<AccountMovement[]> {
        const accountMovements = await this.prisma.accountMovement.findMany({
            where: {
                accountId,
            },
            orderBy: {
                createdAt: orderBy,
            },
        })

        return accountMovements.map(PrismaAccountMovementMapper.toDomain)
    }

    async create(accountMovement: AccountMovement): Promise<void> {
        const data = PrismaAccountMovementMapper.toPrisma(accountMovement)

        await this.prisma.accountMovement.create({
            data,
        })
    }
}

// Garante que a classe seja exportada como um módulo
export default PrismaAccountMovementsRepository;