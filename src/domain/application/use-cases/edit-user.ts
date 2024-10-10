import { Either, left, right } from '@/core/either'
import { User } from '@/domain/application/entities/users'
import { UserRepository } from '@/domain/application/repositories/user-repository'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '@/core/cryptografy/hash-generator'
import { AppError } from '@/core/errors/app-errors'

interface EditUserUseCaseRequest {
    userId: string
    name: string
    email: string
    password: string
    defaultBusiness: string | undefined
    photoFileId: string | undefined
    status: string

}

type EditUserUseCaseResponse = Either<
    AppError,
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
        defaultBusiness,
        photoFileId,
        status,


    }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
        const user = await this.userRepository.findById(userId)

        if (!user) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        const hashedPassword = await this.hashGenerator.hash(password)

        user.name = name
        user.email = email
        user.password = hashedPassword
        user.status = status
        user.defaultBusiness = defaultBusiness
        user.photoFileId = photoFileId

        await this.userRepository.save(user)

        return right({
            user,
        })
    }
}
