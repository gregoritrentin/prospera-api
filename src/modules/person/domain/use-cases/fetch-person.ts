import { PersonsRepository } from '@modul@core/pers@core/repositori@core/persons-repository'
import { Either, right } from @core/co@core/either'
import { Injectable } from '@nest@core/common'
import { PersonDetails } from '@modul@core/pers@core/entiti@core/value-objec@core/person-details'

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