import { AccountMovement } from '@/domain/account/entities/account-movement'
import { AccountMovementsRepository } from '@/domain/account/repositories/account-movement-repository'
import { AccountsRepository } from '@/domain/account/repositories/account-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { MovementType } from '../entities/account-movement'
import { AppError } from '@/core/errors/app-errors'
import { TransactionManager } from '@/core/transaction/transaction-manager'
import { ValidateAccountBalanceUseCase } from './validate-account-balance'
import { LockManager } from '@/core/lock/lock-manager'


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
        private lockManager: LockManager,
        private transactionManager: TransactionManager,
        private validateAccountBalance: ValidateAccountBalanceUseCase,
    ) { }

    async execute({
        accountId,
        businessId,
        type,
        amount,
        description,
    }: CreateAccountMovementUseCaseRequest): Promise<CreateAccountMovementUseCaseResponse> {
        try {
            const lockKey = `account:${accountId}`
            const locked = await this.lockManager.acquire(lockKey)

            if (!locked) {
                return left(AppError.lockAcquisitionFailed({
                    resource: 'account',
                    accountId
                }))
            }

            try {
                return await this.transactionManager.start(async () => {
                    const account = await this.accountsRepository.findById(accountId, businessId)

                    if (!account) {
                        return left(AppError.resourceNotFound('errors.ACCOUNT_NOT_FOUND'))
                    }

                    if (businessId !== account.businessId.toString()) {
                        return left(AppError.notAllowed('errors.RESOURCE_NOT_ALLOWED'))
                    }

                    if (type === 'DEBIT') {
                        const validation = await this.validateAccountBalance.execute({
                            accountId,
                            amount
                        })

                        if (!validation.isValid) {
                            return left(AppError.invalidOperation(validation.reason ?? 'Invalid operation'))
                        }
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
                })
            } finally {
                try {
                    await this.lockManager.release(lockKey)
                } catch (releaseError) {
                    // Aqui podemos logar o erro, mas não lançamos exceção
                    // pois o resultado da operação principal já está definido
                }
            }
        } catch (error) {
            return left(AppError.internalServerError('errors.INTERNAL_SERVER_ERROR'))
        }
    }
}