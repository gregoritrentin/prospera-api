import { InvoiceRepository } from '@/domain/invoice/respositories/invoice-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvoiceDetails } from '@/domain/invoice/entities/value-objects/invoice-details'

interface FetchSaleUseCaseRequest {
    page: number,
    businessId: string,
}

type FetchInvoiceUseCaseResponse = Either<
    null,
    {
        invoices: InvoiceDetails[]
    }
>

@Injectable()
export class FetchInvoicesUseCase {
    constructor(private invoiceRepository: InvoiceRepository) { }

    async execute({ page, businessId }: FetchSaleUseCaseRequest): Promise<FetchInvoiceUseCaseResponse> {
        const invoices = await this.invoiceRepository.findManyDetails({ page }, businessId)

        return right({
            invoices,
        })
    }
}