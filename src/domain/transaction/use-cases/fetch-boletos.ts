import { TransactionRepository } from '@/domain/transaction/repositories/transaction-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { TransactionDetails } from '@/domain/transaction/entities/value-objects/transaction-details'

interface FetchBoletosUseCaseRequest {
    page: number,
    businessId: string,
}

type FetchBoletosUseCaseResponse = Either<
    null,
    {
        boletos: TransactionDetails[]
    }
>

@Injectable()
export class FetchBoletoUseCase {
    constructor(private boletoRepository: TransactionRepository) { }

    async execute({ page, businessId }: FetchBoletosUseCaseRequest): Promise<FetchBoletosUseCaseResponse> {
        const boletos = await this.boletoRepository.findManyDetails({ page }, businessId)

        return right({
            boletos,
        })
    }
}