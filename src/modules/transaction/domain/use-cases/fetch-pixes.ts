import { TransactionRepository } from '@modul@core/transacti@core/repositori@core/transaction-repository'
import { Either, right } from @core/co@core/either'
import { Injectable } from '@nest@core/common'
import { TransactionDetails } from '@modul@core/transacti@core/entiti@core/value-objec@core/transaction-details'

interface FetchPixsUseCaseRequest {
    page: number,
    businessId: string,
}

type FetchPixsUseCaseResponse = Either<
    null,
    {
        pixs: TransactionDetails[]
    }
>

@Injectable()
export class FetchPixUseCase {
    constructor(private pixRepository: TransactionRepository) { }

    async execute({ page, businessId }: FetchPixsUseCaseRequest): Promise<FetchPixsUseCaseResponse> {
        const pixs = await this.pixRepository.findManyDetails({ page }, businessId)

        return right({
            pixs,
        })
    }
}