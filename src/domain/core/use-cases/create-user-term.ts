import { UserTerm } from '@/domain/core/entities/user-term'
import { UserTermRepository } from '@/domain/core/repositories/user-term-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

interface CreateUserTermUseCaseRequest {
    termId: string
    userId: string
    ip: string
}

type CreateUserTermUseCaseResponse = Either<
    null,
    {
        userTerm: UserTerm
    }
>

@Injectable()
export class CreateUserTermUseCase {
    constructor(private businessAppsRepository: UserTermRepository) { }

    async execute({
        termId,
        userId,
        ip,

    }: CreateUserTermUseCaseRequest): Promise<CreateUserTermUseCaseResponse> {
        const userTerm = UserTerm.create({

            termId: new UniqueEntityID(termId),
            userId: new UniqueEntityID(userId),
            ip,

        })

        await this.businessAppsRepository.create(userTerm)

        return right({
            userTerm,
        })
    }
}
