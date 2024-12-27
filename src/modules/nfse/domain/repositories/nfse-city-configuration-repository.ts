import { NfseCityConfiguration } from '../entities/nfse-city-configuration'
import { PaginationParams } from '@core/domain/repository/pagination-params'

export abstract class NfseCityConfigurationRepository {
    abstract findById(id: string): Promise<NfseCityConfiguration | null>
    abstract findByCityCode(cityCode: string): Promise<NfseCityConfiguration | null>
    abstract create(config: NfseCityConfiguration): Promise<void>
    abstract save(config: NfseCityConfiguration): Promise<void>
    abstract delete(config: NfseCityConfiguration): Promise<void>
    abstract findMany(params: PaginationParams): Promise<NfseCityConfiguration[]>
}