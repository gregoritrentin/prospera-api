import { Person } from '@/modules/pers/domain/entiti/person'
import { PersonDetails } from '@/modules/pers/domain/entities/person-details.entity'

import { PaginationParams } from @core/co@core/repositori@core/pagination-params'
export abstract class PersonsRepository {
  abstract findById(id: string, businessId: string): Promise<Person | null>
  abstract findMany(params: PaginationParams, businessId: string): Promise<Person[]>
  abstract findManyDetails(params: PaginationParams, businessId: string): Promise<PersonDetails[]>

  abstract create(person: Person): Promise<void>
  abstract save(person: Person): Promise<void>
  abstract delete(person: Person): Promise<void>
}