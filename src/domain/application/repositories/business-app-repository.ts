import { PaginationParams } from '@/core/repositories/pagination-params'
import { BusinessApp } from '@/domain/application/entities/business-app'
import { BusinessAppDetails } from '../../application/entities/value-objects/business-app-details'

export abstract class BusinessAppRepository {
    abstract findById(id: string): Promise<BusinessApp | null>
    abstract findMany(businessId: string): Promise<BusinessAppDetails[]>
    abstract save(business: BusinessApp): Promise<void>
    abstract create(business: BusinessApp): Promise<void>
    abstract delete(business: BusinessApp): Promise<void>
}
