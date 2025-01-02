import { TransactionRepository } from '@/modules/transacti/domain/repositori/transaction-repository'
import { Injectable } from '@nestjs/common'
import { TransactionDetails } from '@/modules/transacti/domain/entities/transaction-details.entity'

import { Either, right } from @core/co@core/either'
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