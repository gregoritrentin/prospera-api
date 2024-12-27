import { PaginationParams } from '@core/domain/repository/pagination-params'
import { Nfse } from '@/domain/dfe/nfse/entities/nfse'
import { NfseDetails } from '@/domain/dfe/nfse/entities/value-objects/nfse-details'

export abstract class NfseRepository {
    abstract findById(id: string, businessId: string): Promise<Nfse | null>
    abstract findByIdDetails(id: string, businessId: string): Promise<NfseDetails | null>

    // Busca específica por número da NFSe
    abstract findByNfseNumber(nfseNumber: string, businessId: string): Promise<Nfse | null>
    // Busca por número do RPS
    abstract findByRpsNumber(rpsNumber: string, rpsSeries: string, businessId: string): Promise<Nfse | null>

    abstract create(nfse: Nfse): Promise<void>
    abstract save(nfse: Nfse): Promise<void>
    abstract delete(nfse: Nfse): Promise<void>

    abstract findMany(
        params: PaginationParams,
        businessId: string,
        startDate?: Date,
        endDate?: Date
    ): Promise<Nfse[]>

    // Métodos específicos para NFSe
    abstract findByPeriod(
        businessId: string,
        startDate: Date,
        endDate: Date,
        params: PaginationParams
    ): Promise<Nfse[]>

    abstract findByCityConfiguration(
        cityCode: string,
        params: PaginationParams
    ): Promise<Nfse[]>
}