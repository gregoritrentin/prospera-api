import { BoletoRepository } from '@/domain/transaction/repositories/boleto-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { BoletoDetails } from '@/domain/transaction/entities/value-objects/boleto-details'

interface FetchBoletosUseCaseRequest {
    page: number,
    businessId: string,
}

type FetchBoletosUseCaseResponse = Either<
    null,
    {
        boletos: BoletoDetails[]
    }
>

@Injectable()
export class FetchBoletoUseCase {
    constructor(private boletoRepository: BoletoRepository) { }

    async execute({ page, businessId }: FetchBoletosUseCaseRequest): Promise<FetchBoletosUseCaseResponse> {
        const boletos = await this.boletoRepository.findManyDetails({ page }, businessId)

        return right({
            boletos,
        })
    }
}