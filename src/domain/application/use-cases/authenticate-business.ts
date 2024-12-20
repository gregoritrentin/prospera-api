import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '@/domain/application/repositories/user-repository'
import { BusinessRepository } from '@/domain/application/repositories/business-repository'
import { HashComparer } from '@/core/cryptografy/hash-comparer'
import { Encrypter } from '@/core/cryptografy/encrypter'
import { AppError } from '@/core/errors/app-errors'

interface AuthenticateBusinessUseCaseRequest {
  email: string
  password: string
  businessId: string
}

type AuthenticateBusinessUseCaseResponse = Either<
  AppError,
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
      return left(AppError.invalidCredentials())
    }

    if (!business) {
      return left(AppError.invalidCredentials())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      return left(AppError.invalidCredentials())
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