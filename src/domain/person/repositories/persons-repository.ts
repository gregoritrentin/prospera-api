import { PaginationParams } from '@/core/repositories/pagination-params'
import { Person } from '@/domain/person/entities/person'
import { PersonDetails } from '@/domain/person/entities/value-objects/person-details'

export abstract class PersonsRepository {
  abstract findById(id: string, businessId: string): Promise<Person | null>
  abstract findMany(params: PaginationParams, businessId: string): Promise<Person[]>
  abstract findManyDetails(params: PaginationParams, businessId: string): Promise<PersonDetails[]>

  abstract create(person: Person): Promise<void>
  abstract save(person: Person): Promise<void>
  abstract delete(person: Person): Promise<void>
}
