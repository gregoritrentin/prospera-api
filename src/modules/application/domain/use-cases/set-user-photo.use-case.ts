import { Either, left, right } from '@/core/either'
import { AppError } from '@/core/error/app-errors'
import { User } from '@/modules/application/domain/entities/users'
import { UserRepository } from '@/modules/application/domain/repositories/user-repository'
import { Injectable } from '@nestjs/common'

interface SetUserPhotoUseCaseRequest {
    userId: string
    photoFileId: string
}

type SetUserPhotoUseCaseResponse = Either<
    AppError,
    {
        user: User
    }
>

@Injectable()
export class SetUserPhotoUseCase {
    constructor(
        private userRepository: UserRepository,

    ) { }

    async execute({
        userId,
        photoFileId,

    }: SetUserPhotoUseCaseRequest): Promise<SetUserPhotoUseCaseResponse> {

        const user = await this.userRepository.findById(userId)

        if (!user) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        user.photoFileId = photoFileId

        await this.userRepository.setPhoto(userId, photoFileId)

        return right({
            user,
        })
    }
}