import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { User } from '@/domain/user/entities/users'
import { UserRepository } from '@/domain/user/repositories/user-repository'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '@/domain/user/cryptografy/hash-generator'

interface EditUserUseCaseRequest {
    userId: string
    name: string
    email: string
    password: string
    status: string

}

type EditUserUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        user: User
    }
>

@Injectable()
export class EditUserUseCase {
    constructor(
        private userRepository: UserRepository,
        private hashGenerator: HashGenerator,
    ) { }

    async execute({
        userId,
        name,
        email,
        password,
        status,


    }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
        const user = await this.userRepository.findById(userId)

        if (!user) {
            return left(new ResourceNotFoundError())
        }

        const hashedPassword = await this.hashGenerator.hash(password)

        user.name = name
        user.email = email
        user.password = hashedPassword
        user.status = status

        await this.userRepository.save(user)

        return right({
            user,
        })
    }
}
