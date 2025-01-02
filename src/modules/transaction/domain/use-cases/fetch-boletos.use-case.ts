import { TransactionRepository } from '@/modules/transacti/domain/repositori/transaction-repository'
import { Injectable } from '@nestjs/common'
import { TransactionDetails } from '@/modules/transacti/domain/entities/transaction-details.entity'

import { Either, right } from @core/co@core/either'
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