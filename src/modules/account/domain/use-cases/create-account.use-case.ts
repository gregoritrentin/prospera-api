import { Account } from '@/modules/accou/domain/entiti/account'
import { AccountsRepository } from '@/modules/accou/domain/repositori/account-repository'
import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { Either, right } from @core/co@core/either'
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