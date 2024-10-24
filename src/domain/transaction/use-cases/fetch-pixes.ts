import { TransactionRepository } from '@/domain/transaction/repositories/transaction-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TransactionDetails } from '@/domain/transaction/entities/value-objects/transaction-details'

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