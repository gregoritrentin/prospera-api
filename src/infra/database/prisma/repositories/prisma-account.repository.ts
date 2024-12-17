import { PaginationParams } from "@/core/repositories/pagination-params";
import { Account } from "@/domain/account/entities/account";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaAccountMapper } from "../../mappers/prisma-account-mapper";
import { AccountsRepository } from "@/domain//account/repositories/account-repository";

@Injectable()
export class PrismaAccountsRepository implements AccountsRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string, businessId: string): Promise<Account | null> {
        const account = await this.prisma.account.findUnique({
            where: {
                id,
                businessId,
            }
        })

        if (!account) {
            return null
        }
        return PrismaAccountMapper.toDomain(account)
    }

    async findByNumber(number: string, businessId: string): Promise<Account | null> {
        const account = await this.prisma.account.findFirst({
            where: {
                number,
                businessId,
            }
        })

        if (!account) {
            return null
        }
        return PrismaAccountMapper.toDomain(account)
    }

    async findMany({ page }: PaginationParams): Promise<Account[]> {
        const accounts = await this.prisma.account.findMany({
            orderBy: {
                number: 'asc',
            },
            take: 20,

            skip: (page - 1) * 20,
        })

        return accounts.map(PrismaAccountMapper.toDomain)
    }

    async save(account: Account): Promise<void> {
        const data = PrismaAccountMapper.toPrisma(account)

        await this.prisma.account.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

    async create(account: Account): Promise<void> {
        const data = PrismaAccountMapper.toPrisma(account)

        await this.prisma.account.create({
            data,
        })
    }

    async delete(account: Account): Promise<void> {
        const data = PrismaAccountMapper.toPrisma(account)

        await this.prisma.account.delete({
            where: {
                id: data.id,
            }
        })
    }
}