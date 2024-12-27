import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '@/domain/application/repositories/user-repository'
import { HashComparer } from '@core/cryptography/hash-comparer'
import { Encrypter } from '@core/cryptography/encrypter'
import { AppError } from '@core/error/app-errors'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  AppError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private usersRepository: UserRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) { }

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
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
      bus: user.defaultBusiness?.toString(),
    })

    return right({
      accessToken,
    })

  }
}