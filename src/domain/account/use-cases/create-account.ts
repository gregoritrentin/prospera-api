import { Account } from '@/domain/account/entities/account'
import { AccountsRepository } from '@/domain/account/repositories/account-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface CreateAccountUseCaseRequest {
    businessId: string
    number: string
    status: string
}

type CreateAccountUseCaseResponse = Either<
    null,
    {
        account: Account
    }
>

@Injectable()
export class CreateAccountUseCase {
    constructor(private accountsRepository: AccountsRepository) { }

    async execute({
        businessId,
        number,
        status,
    }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
        const account = Account.create({
            businessId: new UniqueEntityID(businessId),
            number,
            status,
        })

        await this.accountsRepository.create(account)

        return right({
            account,
        })
    }
}