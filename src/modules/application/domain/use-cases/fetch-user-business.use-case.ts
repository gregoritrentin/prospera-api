import { UserBusinessDetails } from '@/modules/application/domain/entities/value-objects/user-business-details'
import { UserBusinessRepository } from '@/modules/application/domain/repositories/user-business-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface FetchUserBusinessUseCaseRequest {
  userId: string,
  businessId: string,
}

type FetchUserBusinessUseCaseResponse = Either<
  null,
  {
    userBusiness: UserBusinessDetails[]
  }
>

@Injectable()
export class FetchUserBusinessUseCase {
  constructor(private userBusinessRepository: UserBusinessRepository) { }

  async execute({ userId, businessId }: FetchUserBusinessUseCaseRequest): Promise<FetchUserBusinessUseCaseResponse> {

    const userBusiness = await this.userBusinessRepository.findManyDetails(userId, businessId)

    return right({
      userBusiness,
    })
  }
}