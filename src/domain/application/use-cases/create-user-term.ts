import { UserTerm } from '@/domain/application/entities/user-term'
import { UserTermRepository } from '@/domain/application/repositories/user-term-repository'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { TermRepository } from '../repositories/term-repository'

interface CreateUserTermUseCaseRequest {
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
    constructor(
        private userTermRepository: UserTermRepository,
        private termRepository: TermRepository,
    ) { }

    async execute({

        userId,
        ip,

    }: CreateUserTermUseCaseRequest): Promise<CreateUserTermUseCaseResponse> {

        const latestTerm = await this.termRepository.findLatest();

        const userTerm = UserTerm.create({

            termId: new UniqueEntityID(latestTerm?.id.toString()),
            userId: new UniqueEntityID(userId),
            ip,

        })

        await this.userTermRepository.create(userTerm)

        return right({
            userTerm,
        })
    }
}