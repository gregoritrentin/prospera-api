import { PaginationParams } from '@/core/repositories/pagination-params'
import { Boleto } from '@/domain/transaction/entities/boleto'
import { BoletoDetails } from '../entities/value-objects/boleto-details'

export abstract class BoletoRepository {

    abstract findById(id: string, businessId: string): Promise<Boleto | null>
    abstract findByIdDetails(id: string, businessId: string): Promise<BoletoDetails | null>

    abstract findMany(params: PaginationParams, businessId: string): Promise<Boleto[]>
    abstract findManyDetails(params: PaginationParams, businessId: string): Promise<BoletoDetails[]>

    abstract create(boleto: Boleto): Promise<void>
    abstract save(boleto: Boleto): Promise<void>

}