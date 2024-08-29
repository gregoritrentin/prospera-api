import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { User } from '@/domain/core/entities/users'
import { UserRepository } from '@/domain/core/repositories/user-repository'
import { Injectable } from '@nestjs/common'

interface SetUserPhotoUseCaseRequest {
    userId: string
    photoFileId: string
}

type SetUserPhotoUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
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
            return left(new ResourceNotFoundError())
        }

        user.photoFileId = photoFileId

        await this.userRepository.setPhoto(userId, photoFileId)

        return right({
            user,
        })
    }
}
