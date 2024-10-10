import { PaginationParams } from "@/core/repositories/pagination-params";
import { UserBusinessRepository } from '@/domain/application/repositories/user-business-repository'
import { UserBusiness } from "@/domain/application/entities/user-business";
import { UserBusinessDetails } from "@/domain/application/entities/value-objects/user-business-details";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaUserBusinessMapper } from "../../mappers/prisma-user-business-mapper";
import { PrismaUserBusinessDetailsMapper } from "../../mappers/prisma-user-business-details-mapper";

@Injectable()
export class PrismaUserBusinessRepository implements UserBusinessRepository {

    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<UserBusiness | null> {
        const userBusiness = await this.prisma.userBusiness.findUnique({
            where: {
                id,
            }
        })

        if (!userBusiness) {
            return null
        }
        return PrismaUserBusinessMapper.toDomain(userBusiness)
    }

    async findByUserAndBusiness(userId: string, businessId: string): Promise<UserBusiness | null> {
        const userBusiness = await this.prisma.userBusiness.findUnique({
            where: {
                userBusinessIdentifier: {
                    userId,
                    businessId,
                }
            }
        })

        if (!userBusiness) {
            return null
        }
        return PrismaUserBusinessMapper.toDomain(userBusiness)
    }

    async findMany({ page }: PaginationParams, businessId: string): Promise<UserBusiness[]> {
        const userBusiness = await this.prisma.userBusiness.findMany({
            orderBy: {
                id: 'asc',
            },

            where: {
                businessId,
            },

            take: 20,

            skip: (page - 1) * 20,
        })

        return userBusiness.map(PrismaUserBusinessMapper.toDomain)

    }

    async findManyDetails(userId: string, businessId: string): Promise<UserBusinessDetails[]> {

        const userBusiness = await this.prisma.userBusiness.findMany({
            orderBy: {
                createdAt: 'asc',
            },

            where: {
                businessId,
                userId,
            },

            include: {
                business: true,
                user: true

            },

        })

        return userBusiness.map(PrismaUserBusinessDetailsMapper.toDomain)

    }

    async save(userBusiness: UserBusiness): Promise<void> {
        const data = PrismaUserBusinessMapper.toPrisma(userBusiness)

        await this.prisma.userBusiness.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

    async create(userBusiness: UserBusiness): Promise<void> {
        const data = PrismaUserBusinessMapper.toPrisma(userBusiness)

        await this.prisma.userBusiness.create({
            data,
        })
    }

    async delete(userBusiness: UserBusiness): Promise<void> {
        const data = PrismaUserBusinessMapper.toPrisma(userBusiness)
        await this.prisma.userBusiness.delete({
            where: {
                id: data.id,
            }
        })
    }
}