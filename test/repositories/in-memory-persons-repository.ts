import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PersonsRepository } from '@/domain/person/repositories/persons-repository'
import { Person } from '@/domain/person/entities/person'
import { PersonDetails } from '@/domain/person/entities/value-objects/person-details'


export class InMemoryPersonsRepository implements PersonsRepository {

  public items: Person[] = []
  public itemsDetails: PersonDetails[] = []

  constructor() { }

    async findById(id: string, businessId: string) {

    const person = this.items.find((item) => item.id.toString() === id)

    if (!person) {
      return null
    }

    return person
  }

  async findMany({ page }: PaginationParams) {
    const persons = this.items
      .slice((page - 1) * 20, page * 20)
    return persons
  }

  async findManyDetails({ page }: PaginationParams) {
    const persons = this.itemsDetails
      .slice((page - 1) * 20, page * 20)
    return persons
  }

  async create(person: Person) {
    this.items.push(person)

    DomainEvents.dispatchEventsForAggregate(person.id)
  }

  async save(person: Person) {
    const itemIndex = this.items.findIndex((item) => item.id === person.id)

    this.items[itemIndex] = person

    DomainEvents.dispatchEventsForAggregate(person.id)
  }

  async delete(person: Person) {
    const itemIndex = this.items.findIndex((item) => item.id === person.id)

    this.items.splice(itemIndex, 1)

  }
}
