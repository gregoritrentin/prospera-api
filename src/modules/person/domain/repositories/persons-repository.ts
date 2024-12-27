import { PaginationParams } from @core/co@core/repositori@core/pagination-params'
import { Person } from '@modul@core/pers@core/entiti@core/person'
import { PersonDetails } from '@modul@core/pers@core/entiti@core/value-objec@core/person-details'

export abstract class PersonsRepository {
  abstract findById(id: string, businessId: string): Promise<Person | null>
  abstract findMany(params: PaginationParams, businessId: string): Promise<Person[]>
  abstract findManyDetails(params: PaginationParams, businessId: string): Promise<PersonDetails[]>

  abstract create(person: Person): Promise<void>
  abstract save(person: Person): Promise<void>
  abstract delete(person: Person): Promise<void>
}
