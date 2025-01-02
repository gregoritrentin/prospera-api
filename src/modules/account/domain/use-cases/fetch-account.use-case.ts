import { AccountsRepository } from '@/modules/accou/domain/repositori/account-repository'
import { Injectable } from '@nestjs/common'
import { Account } from '@/core/domain/entities/account.entity'

import { Either, right } from @core/co@core/either'
interface FetchAccountsUseCaseRequest {
    page: number
}

type FetchAccountsUseCaseResponse = Either<
    null,
    {
        accounts: Account[]
    }
>

@Injectable()
export class FetchAccountsUseCase {
    constructor(private accountsRepository: AccountsRepository) { }

    async execute({ page }: FetchAccountsUseCaseRequest): Promise<FetchAccountsUseCaseResponse> {
        const accounts = await this.accountsRepository.findMany({ page })

        return right({
            accounts,
        })
    }
}