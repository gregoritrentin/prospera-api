import { PersonsRepository } from '@/domain/person/repositories/persons-repository'
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
  constructor(private personsRepository: PersonsRepository) { }

  async execute({ page, businessId }: FetchPersonUseCaseRequest): Promise<FetchPersonUseCaseResponse> {

    const person = await this.personsRepository.findManyDetails({ page }, businessId)

    return right({
      person,
    })
  }
}