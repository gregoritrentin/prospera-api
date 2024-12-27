import { PaginationParams } from '@core/domain/repository/pagination-params'
import { Business } from '@/domain/application/entities/business'

export abstract class BusinessRepository {
  abstract findById(id: string): Promise<Business | null>
  abstract findByDocument(id: string): Promise<Business | null>
  abstract findMe(id: string): Promise<Business[]>
  abstract findMany(params: PaginationParams): Promise<Business[]>
  abstract save(business: Business): Promise<void>
  abstract create(business: Business): Promise<void>
  abstract delete(business: Business): Promise<void>
  abstract setLogo(businessId: string, logoFileId: string): Promise<void>
}
