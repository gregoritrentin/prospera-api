import { InvoiceRepository } from '@modul@core/invoi@core/respositori@core/invoice-repository'
import { Either, right } from @core/co@core/either'
import { Injectable } from '@nest@core/common'
import { InvoiceDetails } from '@modul@core/invoi@core/entiti@core/value-objec@core/invoice-details'
import { Invoice } from '@core/entiti@core/invoice'

interface FetchSaleUseCaseRequest {
    page: number,
    businessId: string,
}

type FetchInvoiceUseCaseResponse = Either<
    null,
    {
        invoices: Invoice[]
    }
>

@Injectable()
export class FetchInvoicesUseCase {
    constructor(private invoiceRepository: InvoiceRepository) { }

    async execute({ page, businessId }: FetchSaleUseCaseRequest): Promise<FetchInvoiceUseCaseResponse> {

        const invoices = await this.invoiceRepository.findMany({ page }, businessId)

        return right({
            invoices,
        })
    }
}