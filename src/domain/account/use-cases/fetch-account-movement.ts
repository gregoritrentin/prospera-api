import { Either, left, right } from '@/core/either'
import { AccountMovementsRepository } from '@/domain/account/repositories/account-movement-repository'
import { AccountsRepository } from '@/domain/account/repositories/account-repository'
import { Injectable } from '@nestjs/common'
import { AccountMovement } from '../entities/account-movement'
import { AppError } from '@/core/errors/app-errors'

interface GetAccountMovementUseCaseRequest {
    businessId: string
    movementId: string
}

type GetAccountMovementUseCaseResponse = Either<
    AppError,
    {
        accountMovement: AccountMovement
    }
>

@Injectable()
export class GetAccountMovementUseCase {
    constructor(
        private accountMovementsRepository: AccountMovementsRepository,
        private accountsRepository: AccountsRepository
    ) { }

    async execute({
        businessId,
        movementId,
    }: GetAccountMovementUseCaseRequest): Promise<GetAccountMovementUseCaseResponse> {
        const accountMovement = await this.accountMovementsRepository.findById(movementId)

        if (!accountMovement) {
            return left(AppError.resourceNotFound('errors.MOVEMENT_NOT_FOUND'))
        }

        const account = await this.accountsRepository.findById(
            accountMovement.accountId.toString(),
            businessId
        )

        if (!account) {
            return left(AppError.resourceNotFound('errors.ACCOUNT_NOT_FOUND'))
        }

        if (businessId !== account.businessId.toString()) {
            return left(AppError.notAllowed('errors.RESOURCE_NOT_ALLOWED'))
        }

        return right({
            accountMovement
        })
    }
}