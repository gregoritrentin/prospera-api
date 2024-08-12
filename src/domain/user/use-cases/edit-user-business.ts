import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UserBusiness } from '@/domain/user/entities/user-business'
import { UserBusinessRepository } from '@/domain/user/repositories/user-business-repository'
import { Injectable } from '@nestjs/common'

interface EditUserBusinessUseCaseRequest {
    userbusinessId: string
    role: string
    status: string
}

type EditUserBusinessUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        userbusiness: UserBusiness
    }
>

@Injectable()
export class EditUserBusinessUseCase {
    constructor(
        private userbusinessRepository: UserBusinessRepository,
    ) { }

    async execute({
        userbusinessId,
        role,
        status,

    }: EditUserBusinessUseCaseRequest): Promise<EditUserBusinessUseCaseResponse> {
        const userbusiness = await this.userbusinessRepository.findById(userbusinessId)

        if (!userbusiness) {
            return left(new ResourceNotFoundError())
        }

        userbusiness.role = role
        userbusiness.status = status

        await this.userbusinessRepository.save(userbusiness)

        return right({
            userbusiness,
        })
    }
}
