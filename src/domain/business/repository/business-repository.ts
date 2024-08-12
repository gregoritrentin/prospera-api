import { PaginationParams } from '@/core/repositories/pagination-params'
import { Business } from '@/domain/business/entities/business'

export abstract class BusinessRepository {
  abstract findById(id: string): Promise<Business | null>

  abstract findMe(id: string): Promise<Business[]>
  abstract findMany(params: PaginationParams): Promise<Business[]>

  abstract save(business: Business): Promise<void>
  abstract create(business: Business): Promise<void>
  abstract delete(business: Business): Promise<void>
}
