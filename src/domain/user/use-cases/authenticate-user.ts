import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UserRepository } from '@/domain/user/repositories/user-repository'
//import { BusinessRepository } from '@/domain/business/repository/business-repository'
import { HashComparer } from '@/domain/user/cryptografy/hash-comparer'
import { Encrypter } from '@/domain/user/cryptografy/encrypter'
import { WrongCredentialsError } from '@/domain/user/use-cases/errors/wrong-credentials-error'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
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
    })

    return right({
      accessToken,
    })
  }
}