import { InvoiceRepository } from '@/modules/invoi/domain/respositori/invoice-repository'
import { Injectable } from '@nestjs/common'
import { InvoiceDetails } from '@/modules/invoi/domain/entities/invoice-details.entity'
import { Invoice } from '@/core/domain/entities/invoice.entity'

import { Either, right } from @core/co@core/either'
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