import { AccountMovement } from '@/domain/account/entities/account-movement'
import { AccountMovementsRepository } from '@/domain/account/repositories/account-movement-repository'
import { AccountsRepository } from '@/domain/account/repositories/account-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MovementType } from '../entities/account-movement'
import { AppError } from '@/core/errors/app-errors'

interface CreateAccountMovementUseCaseRequest {
    accountId: string
    businessId: string
    type: MovementType
    amount: number
    description?: string | null
}

type CreateAccountMovementUseCaseResponse = Either<
    AppError,
    {
        accountMovement: AccountMovement
    }
>

@Injectable()
export class CreateAccountMovementUseCase {
    constructor(
        private accountMovementsRepository: AccountMovementsRepository,
        private accountsRepository: AccountsRepository,
    ) { }

    async execute({
        accountId,
        businessId,
        type,
        amount,
        description,
    }: CreateAccountMovementUseCaseRequest): Promise<CreateAccountMovementUseCaseResponse> {
        const account = await this.accountsRepository.findById(accountId, businessId)

        if (!account) {
            return left(AppError.resourceNotFound('errors.ACCOUNT_NOT_FOUND'))
        }

        if (businessId !== account.businessId.toString()) {
            return left(AppError.notAllowed('errors.RESOURCE_NOT_ALLOWED'))
        }

        const accountMovement = AccountMovement.create({
            accountId: new UniqueEntityID(accountId),
            type,
            amount,
            description,
        })

        await this.accountMovementsRepository.create(accountMovement)

        return right({
            accountMovement,
        })
    }
}