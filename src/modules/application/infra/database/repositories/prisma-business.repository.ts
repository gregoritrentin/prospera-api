import { PaginationParams } from "@/core/repositories/pagination-params"
import { BusinessRepository } from "@/modules/application/domain/repositories/business-repository"
import { Business } from "@/modules/application/domain/entities/business"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { PrismaBusinessMapper } from "@/modules/mappers/prisma-business-mapper"

@Injectable()
export class PrismaBusinessRepository implements BusinessRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<Business | null> {
        const business = await this.prisma.business.findUnique({
            where: {
                id,
            }
        })

        if (!business) {
            return null
        }
        return PrismaBusinessMapper.toDomain(business)
    }

    async findByDocument(document: string): Promise<Business | null> {
        const business = await this.prisma.business.findUnique({
            where: {
                document,
            }
        })

        if (!business) {
            return null
        }
        return PrismaBusinessMapper.toDomain(business)
    }

    async findMe(id: string): Promise<Business[]> {

        const user = await this.prisma.business.findMany({
            where: {
                id,
            }
        })

        return user.map(PrismaBusinessMapper.toDomain)

    }

    async findMany({ page }: PaginationParams): Promise<Business[]> {
        const business = await this.prisma.business.findMany({
            orderBy: {
                name: 'asc',
            },
            take: 20,
            skip: (page - 1) * 20,
        })

        return business.map(PrismaBusinessMapper.toDomain)


    }

    async save(business: Business): Promise<void> {
        const data = PrismaBusinessMapper.toPrisma(business)

        await this.prisma.business.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

    async create(business: Business): Promise<void> {
        const data = PrismaBusinessMapper.toPrisma(business)

        await this.prisma.business.create({
            data,
        })
    }

    async delete(business: Business): Promise<void> {
        const data = PrismaBusinessMapper.toPrisma(business)
        await this.prisma.business.delete({
            where: {
                id: data.id,
            }
        })
    }

    async setLogo(businessId: string, logoFileId: string): Promise<void> {
        await this.prisma.business.update({
            where: {
                id: businessId,
            },
            data: {
                logoFileId: logoFileId
            }

        })
    }
}