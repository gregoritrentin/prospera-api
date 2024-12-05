import { AbrasfVersion } from '@/core/types/enums'
import { AbrasfVersion as PrismaAbrasfVersion } from '@prisma/client'

export class PrismaNfseCityConfigurationMapper {
    static toPrisma(abrasfVersion: AbrasfVersion): PrismaAbrasfVersion {
        return abrasfVersion as unknown as PrismaAbrasfVersion
    }

    static toDomain(version: PrismaAbrasfVersion): AbrasfVersion {
        return version as unknown as AbrasfVersion
    }
}