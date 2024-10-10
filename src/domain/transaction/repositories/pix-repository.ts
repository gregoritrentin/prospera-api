import { PaginationParams } from '@/core/repositories/pagination-params'
import { Pix } from '@/domain/transaction/entities/pix'
import { PixDetails } from '@/domain/transaction/entities/value-objects/pix-details'

export abstract class PixRepository {

    abstract findById(id: string, businessId: string): Promise<Pix | null>
    abstract findByIdDetails(id: string, businessId: string): Promise<PixDetails | null>

    abstract findMany(params: PaginationParams, businessId: string): Promise<Pix[]>
    abstract findManyDetails(params: PaginationParams, businessId: string): Promise<PixDetails[]>

    abstract create(boleto: Pix): Promise<void>
    abstract save(boleto: Pix): Promise<void>

}
