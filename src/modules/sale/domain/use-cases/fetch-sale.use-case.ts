import { SalesRepository } from '@/modules/sa/domain/repositori/sales-repository'
import { Injectable } from '@nestjs/common'
import { SaleDetails } from '@/modules/sa/domain/entities/sale-details.entity'

import { Either, right } from @core/co@core/either'
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