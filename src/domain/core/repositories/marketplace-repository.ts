import { PaginationParams } from '@/core/repositories/pagination-params'
import { Marketplace } from '@/domain/core/entities/marketplace'

export abstract class MarketplaceRepository {
  abstract findById(id: string): Promise<Marketplace | null>
  abstract findMany(params: PaginationParams, businessId: string): Promise<Marketplace[]>
  abstract save(business: Marketplace): Promise<void>
  abstract create(business: Marketplace): Promise<void>
  abstract delete(business: Marketplace): Promise<void>
}
