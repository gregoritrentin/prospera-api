import { BusinessOwnerRepository } from "@/domain/core/repositories/business-owner-repository";
import { BusinessOwner } from "@/domain/core/entities/business-owner";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaBusinessOwnerMapper } from "../../mappers/prisma-business-owner-mapper";


@Injectable()
export class PrismaBusinessOwnerRepository implements BusinessOwnerRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<BusinessOwner | null> {
        const businessowner = await this.prisma.businessOwners.findUnique({
            where: {
                id,
            }
        })

        if (!businessowner) {
            return null
        }
        return PrismaBusinessOwnerMapper.toDomain(businessowner)
    }

    async findMany(businessId: string): Promise<BusinessOwner[]> {

        const businessOwner = await this.prisma.businessOwners.findMany({
            orderBy: {
                createdAt: 'asc',
            },

            where: {
                businessId,
            },


        })

        return businessOwner.map(PrismaBusinessOwnerMapper.toDomain)

    }

    async create(businessowner: BusinessOwner): Promise<void> {
        const data = PrismaBusinessOwnerMapper.toPrisma(businessowner)

        await this.prisma.businessOwners.create({
            data,
        })
    }

    async save(businessOwner: BusinessOwner): Promise<void> {
        const data = PrismaBusinessOwnerMapper.toPrisma(businessOwner)

        await this.prisma.businessOwners.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

    async delete(businessOwner: BusinessOwner): Promise<void> {
        const data = PrismaBusinessOwnerMapper.toPrisma(businessOwner)
        await this.prisma.businessOwners.delete({
            where: {
                id: data.id,
            }
        })
    }


}