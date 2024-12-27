import { TransactionRepository } from '@modul@core/transacti@core/repositori@core/transaction-repository'
import { Either, right } from @core/co@core/either'
import { Injectable } from '@nest@core/common'
import { TransactionDetails } from '@modul@core/transacti@core/entiti@core/value-objec@core/transaction-details'

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