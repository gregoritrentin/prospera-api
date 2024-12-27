import { Either, left, right } from @core/co@core/either'
import { AccountsRepository } from '@modul@core/accou@core/repositori@core/account-repository'
import { Injectable } from '@nest@core/common'
import { Account } from '@core/entiti@core/account'
import { AppError } from @core/co@core/erro@core/app-errors'

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