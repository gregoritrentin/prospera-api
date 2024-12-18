import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { User } from '@/domain/application/entities/users'
import { UserRepository } from '@/domain/application/repositories/user-repository'
import { HashGenerator } from '@/core/cryptografy/hash-generator'
import { EmailQueueProducer } from '@/infra/queues/producers/email-queue-producer'
import { AppError } from '@/core/errors/app-errors'

interface CreateUserUseCaseRequest {
  name: string
  email: string
  phone: string
  password: string
  defaultBusiness: string | undefined
  photoFileId: string | undefined
}

type CreateUserUseCaseResponse = Either<
  AppError,
  {
    user: User
  }
>

@Injectable()
export class CreateUserUseCase {
  constructor(
    private usersRepository: UserRepository,
    private emailQueueProducer: EmailQueueProducer,
    private hashGenerator: HashGenerator,
  ) { }

  async execute({
    name,
    email,
    phone,
    password,
    defaultBusiness,
    photoFileId
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(AppError.uniqueConstraintViolation('users', 'email', email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    // Criando o usuário
    const user = User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      defaultBusiness,
      photoFileId,
      status: 'PENDING',
    })

    await this.usersRepository.create(user)

    // Enfileirando o email de confirmação
    await this.emailQueueProducer.execute({
      to: user.email,
      subject: 'Confirmação de cadastro',
      body: 'Sua conta foi criada com sucesso. Por favor, confirme sua conta clicando no link abaixo.',
    })

    return right({
      user,

    })
  }
}