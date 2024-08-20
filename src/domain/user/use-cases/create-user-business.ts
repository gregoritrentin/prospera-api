import { UserBusiness } from '@/domain/user/entities/user-business'
import { UserBusinessRepository } from '@/domain/user/repositories/user-business-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface CreateUserBusinessUseCaseRequest {
  businessId: string
  userId: string
  role: string
}

type CreateUserBusinessUseCaseResponse = Either<
  null,
  {
    userBusiness: UserBusiness
  }
>

@Injectable()
export class CreateUserBusinessUseCase {
  constructor(private userBusinessRepository: UserBusinessRepository) { }

  async execute({
    businessId,
    userId,
    role,

  }: CreateUserBusinessUseCaseRequest): Promise<CreateUserBusinessUseCaseResponse> {

    const userBusiness = UserBusiness.create({
      businessId: new UniqueEntityID(businessId),
      userId: new UniqueEntityID(userId),
      role,
      status: 'PENDING'
    })

    await this.userBusinessRepository.create(userBusiness)

    return right({
      userBusiness,
    })
  }
}
