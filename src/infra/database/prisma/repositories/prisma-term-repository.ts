import { PaginationParams } from "@/core/repositories/pagination-params";
import { Term } from '@/domain/application/entities/term'
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { TermRepository } from "@/domain/application/repositories/term-repository";
import { PrismaTermMapper } from "@/infra/database/mappers/prisma-term-mapper";

@Injectable()
export class PrismaTermRepository implements TermRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<Term | null> {
        const term = await this.prisma.terms.findUnique({
            where: {
                id,
            }
        })

        if (!term) {
            return null
        }
        return PrismaTermMapper.toDomain(term)
    }

    async findLatest(): Promise<Term | null> {

        const latestTerm = await this.prisma.terms.findFirst({
            orderBy: {
                createdAt: 'desc',
            },
        });

        if (!latestTerm) {
            return null;
        }

        return PrismaTermMapper.toDomain(latestTerm)

    }

    async findMany({ page }: PaginationParams): Promise<Term[]> {

        const term = await this.prisma.terms.findMany({
            orderBy: {
                createdAt: 'asc',
            },
            take: 20,

            skip: (page - 1) * 20,
        })

        return term.map(PrismaTermMapper.toDomain)

    }

    async save(term: Term): Promise<void> {
        const data = PrismaTermMapper.toPrisma(term)

        await this.prisma.terms.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

    async create(term: Term): Promise<void> {
        const data = PrismaTermMapper.toPrisma(term)

        await this.prisma.terms.create({
            data,
        })
    }

    async delete(term: Term): Promise<void> {
        const data = PrismaTermMapper.toPrisma(term)
        await this.prisma.terms.delete({
            where: {
                id: data.id,
            }
        })
    }
}