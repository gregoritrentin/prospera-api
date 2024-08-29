import { User } from '@/domain/core/entities/users'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { UserDetails } from '@/domain/core/entities/value-objects/user-details'


export abstract class UserRepository {

  abstract findById(id: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
  abstract findMe(id: string): Promise<UserDetails | null>
  abstract findMany(params: PaginationParams): Promise<User[]>
  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
  abstract delete(user: User): Promise<void>
  abstract setphoto(userId: string, photoFileId: string): Promise<void>
  abstract setDefaultBusiness(userId: string, businessId: string): Promise<void>


}