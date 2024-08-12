import { PersonRepository } from '@/domain/person/repositories/person-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { PersonDetails } from '@/domain/person/entities/value-objects/person-details'

interface FetchPersonUseCaseRequest {
  page: number,
  businessId: string,
}

type FetchPersonUseCaseResponse = Either<
  null,
  {
    person: PersonDetails[]
  }
>

@Injectable()
export class FetchPersonUseCase {
  constructor(private personRepository: PersonRepository) { }

  async execute({ page, businessId }: FetchPersonUseCaseRequest): Promise<FetchPersonUseCaseResponse> {

    const person = await this.personRepository.findManyDetails({ page }, businessId)

    return right({
      person,
    })
  }
}