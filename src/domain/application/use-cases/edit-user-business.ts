import { Either, left, right } from '@/core/either'
import { AppError } from '@/core/errors/app-errors'
import { UserBusiness } from '@/domain/application/entities/user-business'
import { UserBusinessRepository } from '@/domain/application/repositories/user-business-repository'
import { Injectable } from '@nestjs/common'

interface EditUserBusinessUseCaseRequest {
    userbusinessId: string
    role: string
    status: string
}

type EditUserBusinessUseCaseResponse = Either<
    AppError,
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
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        userbusiness.role = role
        userbusiness.status = status

        await this.userbusinessRepository.save(userbusiness)

        return right({
            userbusiness,
        })
    }
}
