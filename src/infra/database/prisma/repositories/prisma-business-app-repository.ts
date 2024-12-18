import { BusinessAppRepository } from "@/domain/application/repositories/business-app-repository";
import { BusinessApp } from "@/domain/application/entities/business-app";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaBusinessAppMapper } from "../../mappers/prisma-business-app-mapper";
import { PrismaBusinessAppDetailsMapper } from "@/infra/database/mappers/prisma-business-app-detail-mapper";

import { BusinessAppDetails } from "@/domain/application/entities/value-objects/business-app-details";


@Injectable()
export class PrismaBusinessAppRepository implements BusinessAppRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<BusinessApp | null> {

        const businessApp = await this.prisma.businessApps.findUnique({
            where: {
                id,
            }
        })

        if (!businessApp) {
            return null
        }

        return PrismaBusinessAppMapper.toDomain(businessApp)
    }

    async findMany(businessId: string): Promise<BusinessAppDetails[]> {

        const BusinessApp = await this.prisma.businessApps.findMany({
            orderBy: {
                createdAt: 'asc',
            },

            where: {
                businessId,
            },
            include: {
                apps: true
            }


        })

        return BusinessApp.map(PrismaBusinessAppDetailsMapper.toDomain)

    }

    async create(businessowner: BusinessApp): Promise<void> {
        const data = PrismaBusinessAppMapper.toPrisma(businessowner)

        await this.prisma.businessApps.create({
            data,
        })
    }

    async save(BusinessApp: BusinessApp): Promise<void> {
        const data = PrismaBusinessAppMapper.toPrisma(BusinessApp)

        await this.prisma.businessApps.update({
            where: {
                id: data.id,
            },
            data,
        })
    }

    async delete(BusinessApp: BusinessApp): Promise<void> {
        const data = PrismaBusinessAppMapper.toPrisma(BusinessApp)
        await this.prisma.businessApps.delete({
            where: {
                id: data.id,
            }
        })
    }


}