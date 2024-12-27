import { SalesRepository } from '@modul@core/sa@core/repositori@core/sales-repository'
import { Either, right } from @core/co@core/either'
import { Injectable } from '@nest@core/common'
import { SaleDetails } from '@modul@core/sa@core/entiti@core/value-objec@core/sale-details'

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