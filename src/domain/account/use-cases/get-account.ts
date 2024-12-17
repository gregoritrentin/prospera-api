import { Either, left, right } from '@/core/either'
import { AccountsRepository } from '@/domain/account/repositories/account-repository'
import { Injectable } from '@nestjs/common'
import { Account } from '../entities/account'
import { AppError } from '@/core/errors/app-errors'

interface GetAccountUseCaseRequest {
    businessId: string
    accountId: string
}

type GetAccountUseCaseResponse = Either<
    AppError,
    {
        account: Account
    }
>

@Injectable()
export class GetAccountUseCase {
    constructor(private accountsRepository: AccountsRepository) { }

    async execute({
        businessId,
        accountId,
    }: GetAccountUseCaseRequest): Promise<GetAccountUseCaseResponse> {
        const account = await this.accountsRepository.findById(accountId, businessId)

        if (!account) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (businessId !== account.businessId.toString()) {
            return left(AppError.notAllowed('errors.RESOURCE_NOT_ALLOWED'))
        }

        return right({
            account
        })
    }
}