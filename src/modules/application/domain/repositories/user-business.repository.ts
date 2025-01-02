import { PaginationParams } from '@/core/domain/repository/pagination-params'
import { UserBusiness } from '@/modules/application/domain/entities/user-business'
import { UserBusinessDetails } from '@/modules/application/domain/entities/value-objects/user-business-details'

export abstract class UserBusinessRepository {
  abstract findById(id: string): Promise<UserBusiness | null>
  abstract findByUserAndBusiness(userId: string, businessId: string): Promise<UserBusiness | null>
  abstract findMany(params: PaginationParams, businessId: string): Promise<UserBusiness[]>
  abstract findManyDetails(userId: string, businessId: string): Promise<UserBusinessDetails[]>
  abstract save(userBusiness: UserBusiness): Promise<void>
  abstract create(userBusiness: UserBusiness): Promise<void>
  abstract delete(userBusiness: UserBusiness): Promise<void>
}