import { SalesRepository } from '@/domain/sale/repositories/sales-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { SaleDetails } from '@/domain/sale/entities/value-objects/sale-details'

interface FetchSaleUseCaseRequest {
    page: number,
    businessId: string,
}

type FetchSaleUseCaseResponse = Either<
    null,
    {
        sales: SaleDetails[]
    }
>

@Injectable()
export class FetchSaleUseCase {
    constructor(private salesRepository: SalesRepository) { }

    async execute({ page, businessId }: FetchSaleUseCaseRequest): Promise<FetchSaleUseCaseResponse> {
        const sales = await this.salesRepository.findManyDetails({ page }, businessId)

        return right({
            sales,
        })
    }
}