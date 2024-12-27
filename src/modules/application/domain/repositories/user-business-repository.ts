import { PaginationParams } from '@core/domain/repository/pagination-params'
import { UserBusiness } from '@/domain/application/entities/user-business'
import { UserBusinessDetails } from '@/domain/application/entities/value-objects/user-business-details'

export abstract class UserBusinessRepository {
  abstract findById(id: string): Promise<UserBusiness | null>
  abstract findByUserAndBusiness(userId: string, businessId: string): Promise<UserBusiness | null>
  abstract findMany(params: PaginationParams, businessId: string): Promise<UserBusiness[]>
  abstract findManyDetails(userId: string, businessId: string): Promise<UserBusinessDetails[]>
  abstract save(userBusiness: UserBusiness): Promise<void>
  abstract create(userBusiness: UserBusiness): Promise<void>
  abstract delete(userBusiness: UserBusiness): Promise<void>
}
