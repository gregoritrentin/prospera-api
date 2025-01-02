import { Invoice } from "@/modules/invoice/domain/entities/invoice"
import { InvoiceItem } from "@/modules/invoice/domain/entities/invoice-item"
import { InvoiceSplit } from "@/modules/invoice/domain/entities/invoice-split"
import { InvoiceTransaction } from "@/modules/invoice/domain/entities/invoice-transaction"
import { InvoiceAttachment } from "@/modules/invoice/domain/entities/invoice-attachment"
import { InvoiceEvent } from "@/modules/invoice/domain/entities/invoice-event"

export class InvoiceItemPresenter {
    static toHttp(item: InvoiceItem) {
        return {
            id: item.id.toString(),
            itemId: item.itemId.toString(),
            itemDescription: item.itemDescription,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            totalPrice: item.totalPrice
        }
    }
}

export class InvoiceSplitPresenter {
    static toHttp(split: InvoiceSplit) {
        return {
            id: split.id.toString(),
            recipientId: split.recipientId.toString(),
            splitType: split.splitType,
            amount: split.amount,
            feeAmount: split.feeAmount
        }
    }
}

export class InvoiceTransactionPresenter {
    static toHttp(transaction: InvoiceTransaction) {
        return {
            id: transaction.id.toString(),
            transactionId: transaction.transactionId.toString()
        }
    }
}

export class InvoiceAttachmentPresenter {
    static toHttp(attachment: InvoiceAttachment) {
        return {
            id: attachment.id.toString(),
            fileId: attachment.fileId.toString()
        }
    }
}

export class InvoiceEventPresenter {
    static toHttp(event: InvoiceEvent) {
        return {
            id: event.id.toString(),
            event: event.event,
            createdAt: event.createdAt
        }
    }
}

export class InvoicePresenter {
    static toHttp(invoice: Invoice) {
        return {
            id: invoice.id.toString(),
            businessId: invoice.businessId.toString(),
            personId: invoice.personId.toString(),
            description: invoice.description,
            notes: invoice.notes,
            paymentLink: invoice.paymentLink,
            status: invoice.status,
            issueDate: invoice.issueDate,
            dueDate: invoice.dueDate,
            paymentDate: invoice.paymentDate,
            paymentLimitDate: invoice.paymentLimitDate,
            grossAmount: invoice.grossAmount,
            discountAmount: invoice.discountAmount,
            amount: invoice.amount,
            paymentAmount: invoice.paymentAmount,
            protestMode: invoice.protestMode,
            protestDays: invoice.protestDays,
            lateMode: invoice.lateMode,
            lateValue: invoice.lateValue,
            interestMode: invoice.interestMode,
            interestDays: invoice.interestDays,
            interestValue: invoice.interestValue,
            discountMode: invoice.discountMode,
            discountDays: invoice.discountDays,
            discountValue: invoice.discountValue,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt,

            items: invoice.items.map(InvoiceItemPresenter.toHttp),
            splits: invoice.splits.map(InvoiceSplitPresenter.toHttp),
            transactions: invoice.transactions.map(InvoiceTransactionPresenter.toHttp),
            attachments: invoice.attachments.map(InvoiceAttachmentPresenter.toHttp),
            events: invoice.events.map(InvoiceEventPresenter.toHttp)
        }
    }
}