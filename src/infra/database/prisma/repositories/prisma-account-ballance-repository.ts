import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { AccountBalanceSnapshot } from '@/domain/account/entities/account-balance-snapshot'
import { AccountBalanceSnapshotRepository } from '@/domain/account/repositories/account-balance-snapshot-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaAccountBalanceSnapshotMapper } from '@/infra/database/mappers/prisma-account-balance-snapshot-mapper'

@Injectable()
export class PrismaAccountBalanceSnapshotRepository implements AccountBalanceSnapshotRepository {
    constructor(private prisma: PrismaService) { }

    async findMany(): Promise<AccountBalanceSnapshot[]> {
        const snapshots = await this.prisma.accountBalanceSnapshot.findMany()

        return snapshots.map(PrismaAccountBalanceSnapshotMapper.toDomain)
    }

    async findById(id: UniqueEntityID): Promise<AccountBalanceSnapshot | null> {
        const snapshot = await this.prisma.accountBalanceSnapshot.findUnique({
            where: {
                id: id.toString(),
            },
        })

        if (!snapshot) {
            return null
        }

        return PrismaAccountBalanceSnapshotMapper.toDomain(snapshot)
    }

    async findByAccountAndPeriod(
        accountId: UniqueEntityID,
        month: number,
        year: number,
    ): Promise<AccountBalanceSnapshot | null> {
        const snapshot = await this.prisma.accountBalanceSnapshot.findFirst({
            where: {
                accountId: accountId.toString(),
                month,
                year,
            },
        })

        if (!snapshot) {
            return null
        }

        return PrismaAccountBalanceSnapshotMapper.toDomain(snapshot)
    }

    async findLatestByAccount(accountId: UniqueEntityID): Promise<AccountBalanceSnapshot | null> {
        const snapshot = await this.prisma.accountBalanceSnapshot.findFirst({
            where: {
                accountId: accountId.toString(),
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        if (!snapshot) {
            return null
        }

        return PrismaAccountBalanceSnapshotMapper.toDomain(snapshot)
    }

    async create(accountBalanceSnapshot: AccountBalanceSnapshot): Promise<void> {
        const data = PrismaAccountBalanceSnapshotMapper.toPrisma(accountBalanceSnapshot)

        await this.prisma.accountBalanceSnapshot.create({
            data,
        })
    }

    async save(accountBalanceSnapshot: AccountBalanceSnapshot): Promise<void> {
        const data = PrismaAccountBalanceSnapshotMapper.toPrisma(accountBalanceSnapshot)

        await this.prisma.accountBalanceSnapshot.update({
            where: {
                id: accountBalanceSnapshot.id.toString(),
            },
            data,
        })
    }

    async delete(accountBalanceSnapshot: AccountBalanceSnapshot): Promise<void> {
        await this.prisma.accountBalanceSnapshot.delete({
            where: {
                id: accountBalanceSnapshot.id.toString(),
            },
        })
    }
}