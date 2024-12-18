import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { TwoFactorAutenticationRepository } from '@/domain/application/repositories/two-factor-autentication'
import { TwoFactorAutentication } from '@/domain/application/entities/two-factor-autentication'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TwoFactorType } from '@/core/types/enums'

@Injectable()
export class PrismaTwoFactorAuthenticationRepository implements TwoFactorAutenticationRepository {
    constructor(private prisma: PrismaService) { }

    async create(twoFactor: TwoFactorAutentication): Promise<void> {
        await this.prisma.twoFactorAuthentication.create({
            data: {
                id: twoFactor.id.toString(),
                userId: twoFactor.userId.toString(),
                type: twoFactor.type,
                code: twoFactor.code,
                expiresAt: twoFactor.expiresAt,
                attempts: twoFactor.attempts,
                verified: twoFactor.verified,
                createdAt: twoFactor.createdAt,
                updatedAt: twoFactor.updatedAt,
            },
        })
    }

    async findActiveByUserAndType(userId: UniqueEntityID, type: TwoFactorType): Promise<TwoFactorAutentication | null> {
        const twoFactor = await this.prisma.twoFactorAuthentication.findFirst({
            where: {
                userId: userId.toString(),
                type,
                verified: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        if (!twoFactor) {
            return null
        }

        return TwoFactorAutentication.create(
            {
                userId: new UniqueEntityID(twoFactor.userId),
                type: twoFactor.type as TwoFactorType,
                code: twoFactor.code,
                expiresAt: twoFactor.expiresAt,
                attempts: twoFactor.attempts,
                verified: twoFactor.verified,
                createdAt: twoFactor.createdAt,
                updatedAt: twoFactor.updatedAt,
            },
            new UniqueEntityID(twoFactor.id),
        )
    }

    async save(twoFactor: TwoFactorAutentication): Promise<void> {
        await this.prisma.twoFactorAuthentication.update({
            where: {
                id: twoFactor.id.toString(),
            },
            data: {
                attempts: twoFactor.attempts,
                verified: twoFactor.verified,
                updatedAt: twoFactor.updatedAt,
            },
        })
    }
}