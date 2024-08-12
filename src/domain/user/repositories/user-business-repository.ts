import { PaginationParams } from '@/core/repositories/pagination-params'
import { UserBusiness } from '@/domain/user/entities/user-business'
import { UserBusinessDetails } from '../entities/value-objects/user-business-details'

export abstract class UserBusinessRepository {
  abstract findById(id: string): Promise<UserBusiness | null>
  abstract findMany(params: PaginationParams, businessId: string): Promise<UserBusiness[]>
  abstract findManyDetails(userId: string, businessId: string): Promise<UserBusinessDetails[]>

  abstract save(userBusiness: UserBusiness): Promise<void>
  abstract create(userBusiness: UserBusiness): Promise<void>
  abstract delete(userBusiness: UserBusiness): Promise<void>
}
