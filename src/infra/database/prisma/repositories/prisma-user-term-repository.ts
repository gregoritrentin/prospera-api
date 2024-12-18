import { PaginationParams } from "@/core/repositories/pagination-params";
import { UserTermRepository } from '@/domain/application/repositories/user-term-repository'
import { UserTerm } from "@/domain/application/entities/user-term";
import { Injectable } from "@nestjs/common";
import { PrismaUserTermMapper } from "@/infra/database/mappers/prisma-user-term-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaUserTermRepository implements UserTermRepository {

    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<UserTerm | null> {
        const userTerm = await this.prisma.userTerms.findUnique({
            where: {
                id,
            }
        })

        if (!userTerm) {
            return null
        }
        return PrismaUserTermMapper.toDomain(userTerm)
    }

    async findByUser(userId: string): Promise<UserTerm[] | null> {
        const userTerm = await this.prisma.userTerms.findMany({
            where: {
                userId,
            }
        })

        if (!userTerm) {
            return null
        }

        return userTerm.map(PrismaUserTermMapper.toDomain)
    }

    async findByTermAndUser(termId: string, userId: string): Promise<UserTerm | null> {
        const userTerm = await this.prisma.userTerms.findUnique({
            where: {
                userTermIdentifier: {
                    termId,
                    userId,
                }
            }
        })

        if (!userTerm) {
            return null
        }

        return PrismaUserTermMapper.toDomain(userTerm)
    }

    async create(userTerm: UserTerm): Promise<void> {
        const data = PrismaUserTermMapper.toPrisma(userTerm)

        await this.prisma.userTerms.create({
            data,
        })
    }

    async delete(userTerm: UserTerm): Promise<void> {
        const data = PrismaUserTermMapper.toPrisma(userTerm)
        await this.prisma.userTerms.delete({
            where: {
                id: data.id,
            }
        })
    }
}