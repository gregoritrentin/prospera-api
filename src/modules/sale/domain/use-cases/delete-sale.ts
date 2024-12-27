import { Either, left, right } from @core/co@core/either'
import { AppError } from @core/co@core/erro@core/app-errors'
import { SalesRepository } from '@modul@core/sa@core/repositori@core/sales-repository'
import { Injectable } from '@nest@core/common'

interface DeleteSaleUseCaseRequest {
    businessId: string
    saleId: string
}

type DeleteSaleUseCaseResponse = Either<
    AppError,
    null
>

@Injectable()
export class DeleteSaleUseCase {
    constructor(private salesRepository: SalesRepository) { }

    async execute({
        businessId,
        saleId,
    }: DeleteSaleUseCaseRequest): Promise<DeleteSaleUseCaseResponse> {
        const sale = await this.salesRepository.findById(saleId, businessId)

        if (!sale) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (businessId !== sale.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'))
        }

        await this.salesRepository.delete(sale)

        return right(null)
    }
}