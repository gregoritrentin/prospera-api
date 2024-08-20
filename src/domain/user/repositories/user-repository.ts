import { User } from '@/domain/user/entities/users'
import { PaginationParams } from '@/core/repositories/pagination-params'


export abstract class UserRepository {

  abstract findById(id: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>

  abstract findMe(id: string): Promise<User[]>
  abstract findMany(params: PaginationParams): Promise<User[]>

  abstract create(user: User): Promise<void>
  abstract save(user: User): Promise<void>
  abstract delete(user: User): Promise<void>

}