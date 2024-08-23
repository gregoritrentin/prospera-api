import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { User } from '@/domain/user/entities/users'
import { Email } from '@/domain/email/entities/email'
import { UserRepository } from '@/domain/user/repositories/user-repository'
import { HashGenerator } from '@/domain/cryptografy/hash-generator'
import { UserAlreadyExistsError } from '@/domain/user/use-cases/errors/user-already-exists-error'
import { SendAndCreateEmailUseCase } from '@/domain/email/use-cases/send-and-create-email'

interface CreateUserUseCaseRequest {
  name: string
  email: string
  password: string
  defaultBusiness: string | undefined
  photoFileId: string | undefined
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
    private sendAndCreateEmail: SendAndCreateEmailUseCase,
    private hashGenerator: HashGenerator,
  ) { }

  async execute({
    name,
    email,
    password,
    defaultBusiness,
    photoFileId

  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    //criando o usário
    const user = User.create({
      name,
      email,
      password: hashedPassword,
      defaultBusiness,
      photoFileId,
      status: 'PENDING',
    })

    await this.usersRepository.create(user)

    //envio e criação do e-mail
    const userEmail = Email.create({
      to: user.email,
      subject: 'Confirmação de cadastro',
      body: 'Sua conta foi criada com sucesso. Por favor, confirme sua conta clicando no link abaixo.',
      status: 'PENDING',
    })

    await this.sendAndCreateEmail.execute(userEmail)

    return right({
      user,
    })
  }
}