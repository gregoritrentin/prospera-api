import { Person } from '@/domain/person/entities/person'
import { PersonRepository } from '@/domain/person/repositories/person-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface CreatePersonUseCaseRequest {
  businessId: string
  name: string
  phone: string
  email: string
  document: string
  addressLine1: string
  addressLine2: string
  addressLine3?: string | null
  neighborhood: string
  postalCode: string
  countryCode: string
  state: string
  city: string
  status: string
  notes?: string | null
}

type CreatePersonUseCaseResponse = Either<
  null,
  {
    person: Person
  }
>

@Injectable()
export class CreatePersonUseCase {
  constructor(private personRepository: PersonRepository) { }

  async execute({
    businessId,
    name,
    phone,
    email,
    document,
    addressLine1,
    addressLine2,
    addressLine3,
    neighborhood,
    postalCode,
    countryCode,
    state,
    city,
    status,
    notes

  }: CreatePersonUseCaseRequest): Promise<CreatePersonUseCaseResponse> {
    const person = Person.create({
      businessId: new UniqueEntityID(businessId),
      name,
      phone,
      email,
      document,
      addressLine1,
      addressLine2,
      addressLine3,
      neighborhood,
      postalCode,
      countryCode,
      state,
      city,
      status,
      notes
      ,
    })

    await this.personRepository.create(person)

    return right({
      person,
    })
  }
}
