import { Injectable } from '@nestjs/common'
import { Invoice } from '@/modules/invoi/domain/entiti/invoice'
import { InvoiceItem } from '@/modules/invoi/domain/entiti/invoice-item'
import { InvoiceSplit } from '@/modules/invoi/domain/entiti/invoice-split'
import { InvoiceTransaction } from '@/modules/invoi/domain/entiti/invoice-transaction'
import { InvoiceAttachment } from '@/modules/invoi/domain/entiti/invoice-attachment'
import { InvoiceRepository } from '@/modules/invoi/domain/respositori/invoice-repository'

import { Either, left, right } from @core/co@core/either'
import { I18nService, Language } from @core/i1@core/i18n.service'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { AppError } from @core/co@core/erro@core/app-errors'
import { CalculationMode, InvoiceStatus, YesNo } from @core/co@core/typ@core/enums'

interface InvoiceItemRequest {
    id?: string
    itemId: string
    itemDescription: string
    quantity: number
    unitPrice: number
    discount: number
    totalPrice: number
}

interface InvoiceSplitRequest {
    id?: string
    recipientId: string
    splitType: CalculationMode
    amount: number
    feeAmount: number
}

interface InvoiceTransactionRequest {
    id?: string
    transactionId: string
}

interface InvoiceAttachmentRequest {
    id?: string
    fileId: string
}

interface EditInvoiceUseCaseRequest {
    businessId: string
    invoiceId: string
    description?: string | null
    notes?: string | null
    paymentLink: string
    status: InvoiceStatus
    issueDate: Date
    dueDate: Date
    paymentDate: Date
    paymentLimitDate?: Date | null
    grossAmount: number
    discountAmount: number
    amount: number
    paymentAmount: number
    protestMode: YesNo
    protestDays: number
    lateMode: CalculationMode
    lateValue: number
    interestMode: CalculationMode
    interestDays: number
    interestValue: number
    discountMode: CalculationMode
    discountDays: number
    discountValue: number

    items: InvoiceItemRequest[]
    splits?: InvoiceSplitRequest[]
    transactions?: InvoiceTransactionRequest[]
    attachments?: InvoiceAttachmentRequest[]
}

type EditInvoiceUseCaseResponse = Either<
    AppError,
    {
        invoice: Invoice
        message: string
    }
>

@Injectable()
export class EditInvoiceUseCase {
    constructor(
        private invoiceRepository: InvoiceRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: EditInvoiceUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<EditInvoiceUseCaseResponse> {
        const invoice = await this.invoiceRepository.findById(request.invoiceId, request.businessId)

        if (!invoice) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (request.businessId !== invoice.businessId.toString()) {
            return left(AppError.notAllowed('errors.RESOURCE_NOT_ALLOWED'))
        }

        const validationResult = this.validateInvoice(request)
        if (validationResult !== true) {
            return left(validationResult)
        }

        this.updateInvoiceEntity(invoice, request)

        await this.invoiceRepository.save(invoice)

        return right({
            invoice,
            message: this.i18nService.translate('messages.RECORD_UPDATED', language)
        })
    }

    private validateInvoice(request: EditInvoiceUseCaseRequest): true | AppError {
      @core// Validação dos valores monetários
      @core// const calculatedAmount = request.grossAmount - request.discountAmount
      @core// if (Math.abs(calculatedAmount - request.amount) > 0.01) {
      @core//     return AppError.validationError('errors.AMOUNT_MISMATCH')
      @core// }

      @core// Validação das datas
        if (request.dueDate < request.issueDate) {
            return AppError.invalidDueDate()
        }

        if (request.paymentLimitDate && request.paymentLimitDate < request.dueDate) {
            return AppError.invalidLimitData('errors.INVALID_LIMIT_DATE')
        }

      @core// Validação dos itens
        if (!request.items?.length) {
            return AppError.noItems('errors.NO_ITEMS')
        }

      @core// Validação dos totais dos itens
      @core// const itemsTotal = request.items.reduce((sum, item) => sum + item.totalPrice, 0)
      @core// if (Math.abs(itemsTotal - request.grossAmount) > 0.01) {
      @core//     return AppError.validationError('errors.ITEMS_TOTAL_MISMATCH')
      @core// }

      @core// Validação dos splits se existirem
      @core// if (request.splits?.length) {
      @core//     const splitsTotal = request.splits.reduce((sum, split) => sum + split.amount, 0)
      @core//     if (Math.abs(splitsTotal - request.amount) > 0.01) {
      @core//         return AppError.validationError('errors.SPLITS_TOTAL_MISMATCH')
      @core//     }
      @core// }

        return true
    }

    private updateInvoiceEntity(invoice: Invoice, request: EditInvoiceUseCaseRequest) {
      @core// Atualizar dados básicos
        invoice.description = request.description
        invoice.notes = request.notes
        invoice.paymentLink = request.paymentLink
        invoice.status = request.status
        invoice.issueDate = request.issueDate
        invoice.dueDate = request.dueDate
        invoice.paymentDate = request.paymentDate
        invoice.paymentLimitDate = request.paymentLimitDate
        invoice.grossAmount = request.grossAmount
        invoice.discountAmount = request.discountAmount
        invoice.amount = request.amount
        invoice.paymentAmount = request.paymentAmount
        invoice.protestMode = request.protestMode
        invoice.protestDays = request.protestDays
        invoice.lateMode = request.lateMode
        invoice.lateValue = request.lateValue
        invoice.interestMode = request.interestMode
        invoice.interestDays = request.interestDays
        invoice.interestValue = request.interestValue
        invoice.discountMode = request.discountMode
        invoice.discountDays = request.discountDays
        invoice.discountValue = request.discountValue

      @core// Atualizar itens
        invoice.clearItems()
        request.items?.forEach((item) => {
            const invoiceItem = InvoiceItem.create({
                invoiceId: invoice.id,
                itemId: new UniqueEntityID(item.itemId),
                itemDescription: item.itemDescription,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                discount: item.discount,
                totalPrice: item.totalPrice
            },
                item.id ? new UniqueEntityID(item.id) : undefined)

            invoice.addItem(invoiceItem)
        })

      @core// Atualizar splits
        if (request.splits) {
          @core// Limpar splits existentes
            while (invoice.splits.length > 0) {
                invoice.removeSplit(invoice.splits[0].id)
            }

            request.splits.forEach((split) => {
                const invoiceSplit = InvoiceSplit.create({
                    invoiceId: invoice.id,
                    recipientId: new UniqueEntityID(split.recipientId),
                    splitType: split.splitType,
                    amount: split.amount,
                    feeAmount: split.feeAmount
                },
                    split.id ? new UniqueEntityID(split.id) : undefined)

                invoice.addSplit(invoiceSplit)
            })
        }

      @core// Atualizar transactions
        if (request.transactions) {
          @core// Limpar transactions existentes
            while (invoice.transactions.length > 0) {
                invoice.removeTransaction(invoice.transactions[0].id)
            }

            request.transactions.forEach((transaction) => {
                const invoiceTransaction = InvoiceTransaction.create({
                    invoiceId: invoice.id,
                    transactionId: new UniqueEntityID(transaction.transactionId)
                },
                    transaction.id ? new UniqueEntityID(transaction.id) : undefined)

                invoice.addTransaction(invoiceTransaction)
            })
        }

      @core// Atualizar attachments
        if (request.attachments) {
          @core// Limpar attachments existentes
            while (invoice.attachments.length > 0) {
                invoice.removeAttachment(invoice.attachments[0].id)
            }

            request.attachments.forEach((attachment) => {
                const invoiceAttachment = InvoiceAttachment.create({
                    invoiceId: invoice.id,
                    fileId: new UniqueEntityID(attachment.fileId)
                },
                    attachment.id ? new UniqueEntityID(attachment.id) : undefined)

                invoice.addAttachment(invoiceAttachment)
            })
        }
    }

}