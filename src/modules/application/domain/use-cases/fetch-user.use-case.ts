import { UserRepository } from '@/modules/application/domain/repositories/user-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { User } from '@/modules/application/domain/entities/users'

interface FetchUserUseCaseRequest {
    page: number,
}

type FetchUserUseCaseResponse = Either<
    null,
    {
        user: User[]
    }
>

@Injectable()
export class FetchUserUseCase {
    constructor(private userRepository: UserRepository) { }

    async execute({ page }: FetchUserUseCaseRequest): Promise<FetchUserUseCaseResponse> {

        const user = await this.userRepository.findMany({ page })

        return right({
            user,
        })
    }
}