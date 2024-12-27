
import { BusinessOwner } from '@/domain/application/entities/business-owner'

export abstract class BusinessOwnerRepository {
    abstract findById(id: string): Promise<BusinessOwner | null>
    abstract findMany(businessId: string): Promise<BusinessOwner[]>
    abstract create(business: BusinessOwner): Promise<void>
    abstract save(business: BusinessOwner): Promise<void>
    abstract delete(business: BusinessOwner): Promise<void>

}
