import { Either, left, right } from '@/core/either'
import { AppError } from '@/core/errors/app-errors'
import { Invoice } from '@/domain/invoice/entities/invoice'
import { InvoiceRepository } from '@/domain/invoice/respositories/invoice-repository'
import { Injectable } from '@nestjs/common'
import { InvoiceStatus } from '@/core/types/enums'

interface CancelInvoiceUseCaseRequest {
    businessId: string
    invoiceId: string
}

type CancelInvoiceUseCaseResponse = Either<
    AppError,
    {
        invoice: Invoice
    }
>

@Injectable()
export class CancelInvoiceUseCase {
    constructor(private invoiceRepository: InvoiceRepository) { }

    async execute({
        businessId,
        invoiceId,
    }: CancelInvoiceUseCaseRequest): Promise<CancelInvoiceUseCaseResponse> {

        const invoice = await this.invoiceRepository.findById(invoiceId, businessId)

        if (!invoice) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (businessId !== invoice.businessId.toString()) {
            return left(AppError.notAllowed('errors.RESOURCE_NOT_ALLOWED'))
        }

        // Validate if invoice can be canceled based on its current status
        const cancelableStatuses = [
            InvoiceStatus.CANCELED,
            InvoiceStatus.PAID
        ]

        if (!cancelableStatuses.includes(invoice.status)) {
            return left(
                AppError.invoiceCancelationFailed({
                    status: invoice.status,
                    message: `Invoice cannot be canceled when status is ${invoice.status}`,
                })
            )
        }

        // If invoice was already paid or partially paid
        if (invoice.paymentAmount > 0) {
            return left(
                AppError.invoiceCancelationFailed({
                    paymentAmount: invoice.paymentAmount,
                    message: 'Cannot cancel invoice with existing payments',
                })
            )
        }

        try {
            invoice.status = InvoiceStatus.CANCELED
            invoice.notes = invoice.notes
                ? `${invoice.notes}\nInvoice canceled.`
                : 'Invoice canceled.'

            await this.invoiceRepository.save(invoice)

            return right({
                invoice,
            })
        } catch (error) {
            return left(
                AppError.invoiceCancelationFailed({
                    error,
                    message: 'Failed to cancel invoice',
                })
            )
        }
    }
}