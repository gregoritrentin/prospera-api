import { Business } from '@/domain/application/entities/business'
import { BusinessRepository } from '@/domain/application/repositories/business-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface FetchBusinessUseCaseRequest {
  page: number
}

type FetchBusinessUseCaseResponse = Either<
  null,
  {
    business: Business[]
  }
>

@Injectable()
export class FetchBusinessUseCase {
  constructor(private businessRepository: BusinessRepository) { }

  async execute({
    page,
  }: FetchBusinessUseCaseRequest): Promise<FetchBusinessUseCaseResponse> {
    const business = await this.businessRepository.findMany({ page })

    return right({
      business,
    })
  }
}