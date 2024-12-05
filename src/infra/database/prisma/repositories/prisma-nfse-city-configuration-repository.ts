// src/infra/nfse/repositories/prisma/prisma-nfse-city-configuration-repository.ts
import { Injectable } from '@nestjs/common'
import { NfseCityConfigurationRepository } from '@/domain/dfe/nfse/repositories/nfse-city-configuration-repository'
import { NfseCityConfiguration } from '@/domain/dfe/nfse/entities/nfse-city-configuration'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaService } from '../prisma.service'
import { PrismaNfseCityConfigurationMapper } from '@/infra/database/mappers/prisma-nfse-configuration-mapper'
import { Prisma } from '@prisma/client'

@Injectable()
export class PrismaNfseCityConfigurationRepository implements NfseCityConfigurationRepository {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<NfseCityConfiguration | null> {
        const configuration = await this.prisma.nfseCityConfiguration.findUnique({
            where: { id }
        })

        if (!configuration) return null

        return NfseCityConfiguration.create(
            {
                name: configuration.name,
                cityCode: configuration.cityCode,
                stateCode: configuration.stateCode,
                abrasfVersion: PrismaNfseCityConfigurationMapper.toDomain(configuration.abrasfVersion),
                sandboxUrl: configuration.sandboxUrl,
                productionUrl: configuration.productionUrl,
                queryUrl: configuration.queryUrl,
                timeout: configuration.timeout,
                specificFields: configuration.specificFields as Record<string, any>,
                createdAt: configuration.createdAt,
                updatedAt: configuration.updatedAt
            },
            new UniqueEntityID(configuration.id)
        )
    }

    async findByCityCode(cityCode: string): Promise<NfseCityConfiguration | null> {
        const configuration = await this.prisma.nfseCityConfiguration.findUnique({
            where: { cityCode }
        })

        if (!configuration) return null

        return NfseCityConfiguration.create(
            {
                name: configuration.name,
                cityCode: configuration.cityCode,
                stateCode: configuration.stateCode,
                abrasfVersion: PrismaNfseCityConfigurationMapper.toDomain(configuration.abrasfVersion),
                sandboxUrl: configuration.sandboxUrl,
                productionUrl: configuration.productionUrl,
                queryUrl: configuration.queryUrl,
                timeout: configuration.timeout,
                specificFields: configuration.specificFields as Record<string, any>,
                createdAt: configuration.createdAt,
                updatedAt: configuration.updatedAt
            },
            new UniqueEntityID(configuration.id)
        )
    }

    async create(config: NfseCityConfiguration): Promise<void> {
        await this.prisma.nfseCityConfiguration.create({
            data: {
                id: config.id.toString(),
                name: config.name,
                cityCode: config.cityCode,
                stateCode: config.stateCode,
                abrasfVersion: PrismaNfseCityConfigurationMapper.toPrisma(config.abrasfVersion),
                sandboxUrl: config.sandboxUrl,
                productionUrl: config.productionUrl,
                queryUrl: config.queryUrl,
                timeout: config.timeout,
                specificFields: config.specificFields as Prisma.InputJsonValue,
                createdAt: config.createdAt,
                updatedAt: config.updatedAt
            }
        })
    }

    async save(config: NfseCityConfiguration): Promise<void> {
        await this.prisma.nfseCityConfiguration.update({
            where: { id: config.id.toString() },
            data: {
                name: config.name,
                cityCode: config.cityCode,
                stateCode: config.stateCode,
                abrasfVersion: PrismaNfseCityConfigurationMapper.toPrisma(config.abrasfVersion),
                sandboxUrl: config.sandboxUrl,
                productionUrl: config.productionUrl,
                queryUrl: config.queryUrl,
                timeout: config.timeout,
                //specificFields: config.specificFields,
                specificFields: config.specificFields as Prisma.InputJsonValue,
                updatedAt: config.updatedAt
            }
        })
    }

    async delete(config: NfseCityConfiguration): Promise<void> {
        await this.prisma.nfseCityConfiguration.delete({
            where: { id: config.id.toString() }
        })
    }

    async findMany({ page }: PaginationParams): Promise<NfseCityConfiguration[]> {
        const configurations = await this.prisma.nfseCityConfiguration.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            skip: (page - 1) * 20,
            include: {
                city: true,
                state: true
            }
        })

        return configurations.map((configuration) =>
            NfseCityConfiguration.create(
                {
                    name: configuration.name,
                    cityCode: configuration.cityCode,
                    stateCode: configuration.stateCode,
                    abrasfVersion: PrismaNfseCityConfigurationMapper.toDomain(configuration.abrasfVersion),
                    sandboxUrl: configuration.sandboxUrl,
                    productionUrl: configuration.productionUrl,
                    queryUrl: configuration.queryUrl,
                    timeout: configuration.timeout,
                    specificFields: configuration.specificFields as Record<string, any>,
                    createdAt: configuration.createdAt,
                    updatedAt: configuration.updatedAt
                },
                new UniqueEntityID(configuration.id)
            )
        )
    }
}