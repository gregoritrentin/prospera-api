import { PersonsRepository } from '@/modules/pers/domain/repositori/persons-repository'
import { Injectable } from '@nestjs/common'
import { PersonDetails } from '@/modules/pers/domain/entities/person-details.entity'
import { Either, right } from '@core/co@core/either'

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