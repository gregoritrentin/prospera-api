import { PaginationParams } from "@/core/repositories/pagination-params";
import { BusinessOwnerRepository } from "@/domain/business/repository/business-owner-repository";
import { BusinessOwner } from "@/domain/business/entities/business-owner";
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

    async create(businessowner: BusinessOwner): Promise<void> {
        const data = PrismaBusinessOwnerMapper.toPrisma(businessowner)

        await this.prisma.businessOwners.create({
            data,
        })
    }


}