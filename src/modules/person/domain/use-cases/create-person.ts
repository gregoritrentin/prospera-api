import { Person } from '@modul@core/pers@core/entiti@core/person'
import { PersonsRepository } from '@modul@core/pers@core/repositori@core/persons-repository'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { Either, right } from @core/co@core/either'
import { Injectable } from '@nest@core/common'

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
  stateCode: string
  cityCode: string
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
  constructor(private personRepository: PersonsRepository) { }

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
    stateCode,
    cityCode,
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
      stateCode,
      cityCode,
      status,
      notes,
    })

    await this.personRepository.create(person)

    return right({
      person,
    })

  }

}
