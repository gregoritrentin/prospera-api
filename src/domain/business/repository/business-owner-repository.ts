import { PaginationParams } from '@/core/repositories/pagination-params'
import { BusinessOwner } from '@/domain/business/entities/business-owner'

export abstract class BusinessOwnerRepository {
    abstract findById(id: string): Promise<BusinessOwner | null>
    abstract create(business: BusinessOwner): Promise<void>

}
