import { PaginationParams } from "@/core/repositories/pagination-params"
import { App } from '@/modules/application/domain/entities/app'
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { AppRepository } from "@/modules/application/domain/repositories/app-repository"
import { PrismaAppMapper } from "@/core/infra/database/mappers/prisma-app-mapper"

@Injectable()
export class PrismaAppRepository implements AppRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<App | null> {
        const app = await this.prisma.app.findUnique({
            where: {
                id,
            }
        })

        if (!app) {
            return null
        }
        return PrismaAppMapper.toDomain(app)
    }

    async findMany({ page }: PaginationParams): Promise<App[]> {

        const app = await this.prisma.app.findMany({
            orderBy: {
                name: 'asc',
            },
            take: 20,


            skip: (page - 1) * 20,
        })

        return app.map(PrismaAppMapper.toDomain)

    }

    async findManyDetails({ page }: PaginationParams): Promise<App[]> {

        const app = await this.prisma.app.findMany({
            orderBy: {
                name: 'asc',
            },
            take: 20,



            skip: (page - 1) * 20,
        })

        return app.map(PrismaAppMapper.toDomain)

    }

    async save(app: App): Promise<void> {
        const data = PrismaAppMapper.toPrisma(app)

        await this.prisma.app.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

    async create(app: App): Promise<void> {
        const data = PrismaAppMapper.toPrisma(app)

        await this.prisma.app.create({
            data,
        })
    }

    async delete(app: App): Promise<void> {
        const data = PrismaAppMapper.toPrisma(app)
        await this.prisma.app.delete({
            where: {
                id: data.id,
            }
        })
    }
}