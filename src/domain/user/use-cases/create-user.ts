import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { User } from '@/domain/user/entities/users'
import { UserRepository } from '@/domain/user/repositories/user-repository'
import { HashGenerator } from '@/domain/user/cryptografy/hash-generator'
import { UserAlreadyExistsError } from '@/domain/user/use-cases/errors/user-already-exists-error'

interface CreateUserUseCaseRequest {
  name: string
  email: string
  password: string

}

type CreateUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User
  }
>

@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersRepository: UserRepository,
    private hashGenerator: HashGenerator,
  ) { }

  async execute({
    name,
    email,
    password,

  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {

    const userWithSameEmail =
      await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
      status: 'PENDING',
    })

    await this.usersRepository.create(user)

    return right({
      user,
    })
  }
}