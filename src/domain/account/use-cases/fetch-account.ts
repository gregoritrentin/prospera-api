import { AccountsRepository } from '@/domain/account/repositories/account-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Account } from '../entities/account'

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