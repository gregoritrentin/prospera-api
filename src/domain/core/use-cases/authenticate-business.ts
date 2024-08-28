import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '@/domain/core/repositories/user-repository'
import { BusinessRepository } from '@/domain/core/repositories/business-repository'
//import { UserBusinessRepository } from '@/domain/main/repositories/user-business-repository'
import { HashComparer } from '@/domain/cryptografy/hash-comparer'
import { Encrypter } from '@/domain/cryptografy/encrypter'
import { WrongCredentialsError } from '@/domain/core/use-cases/errors/wrong-credentials-error'

interface AuthenticateBusinessUseCaseRequest {
  email: string
  password: string
  businessId: string
}

type AuthenticateBusinessUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateBusinessUseCase {
  constructor(
    private userRepository: UserRepository,
    private businessRepository: BusinessRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) { }

  async execute({
    email,
    password,
    businessId,
  }: AuthenticateBusinessUseCaseRequest): Promise<AuthenticateBusinessUseCaseResponse> {

    const user = await this.userRepository.findByEmail(email)

    const business = await this.businessRepository.findById(businessId)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    if (!business) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }



    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      bus: business.id.toString(),
    })

    return right({
      accessToken,
    })
  }
}