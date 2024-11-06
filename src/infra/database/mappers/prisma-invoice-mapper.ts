import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Invoice } from '@/domain/invoice/entities/invoice'
import { InvoiceItem } from '@/domain/invoice/entities/invoice-item'
import { InvoiceSplit } from '@/domain/invoice/entities/invoice-split'
import { InvoiceTransaction } from '@/domain/invoice/entities/invoice-transaction'
import { InvoiceAttachment } from '@/domain/invoice/entities/invoice-attachment'
import { InvoiceEvent } from '@/domain/invoice/entities/invoice-event'
import {
    Invoice as PrismaInvoice,
    InvoiceItem as PrismaInvoiceItem,
    InvoiceSplit as PrismaInvoiceSplit,
    InvoiceTransaction as PrismaInvoiceTransaction,
    InvoiceAttachment as PrismaInvoiceAttachment,
    InvoiceEvent as PrismaInvoiceEvent,
    Prisma
} from '@prisma/client'
import { CalculationMode, InvoiceStatus, YesNo } from '@/core/types/enums'

export class PrismaInvoiceMapper {
    static toDomain(raw: PrismaInvoice & {
        invoiceItem?: PrismaInvoiceItem[]
        invoiceSplit?: PrismaInvoiceSplit[]
        invoiceTransaction?: PrismaInvoiceTransaction[]
        invoiceAttachment?: PrismaInvoiceAttachment[]
        invoiceEvent?: PrismaInvoiceEvent[]
    }): Invoice {
        return Invoice.create(
            {
                businessId: new UniqueEntityID(raw.businessId),
                personId: new UniqueEntityID(raw.personId),
                description: raw.description,
                notes: raw.notes,
                paymentLink: raw.paymentLink,
                status: raw.status as unknown as InvoiceStatus,
                issueDate: raw.issueDate,
                dueDate: raw.dueDate,
                paymentDate: raw.paymentDate,
                paymentLimitDate: raw.paymentLimitDate,
                grossAmount: raw.grossAmount,
                discountAmount: raw.discountAmount,
                amount: raw.amount,
                paymentAmount: raw.paymentAmount,
                protestMode: raw.protestMode as unknown as YesNo,
                protestDays: raw.protestDays,
                lateMode: raw.lateMode as unknown as CalculationMode,
                lateValue: raw.lateValue,
                interestMode: raw.interestMode as unknown as CalculationMode,
                interestDays: raw.interestDays,
                interestValue: raw.interestValue,
                discountMode: raw.discountMode as unknown as CalculationMode,
                discountDays: raw.discountDays,
                discountValue: raw.discountValue,
                items: raw.invoiceItem?.map(item => InvoiceItem.create(
                    {
                        invoiceId: new UniqueEntityID(raw.id),
                        itemId: new UniqueEntityID(item.itemId),
                        itemDescription: item.itemDescription,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        discount: item.discount,
                        totalPrice: item.totalPrice,
                    },
                    new UniqueEntityID(item.id)
                )) || [],
                splits: raw.invoiceSplit?.map(split => InvoiceSplit.create(
                    {
                        invoiceId: new UniqueEntityID(raw.id),
                        recipientId: new UniqueEntityID(split.recipientId),
                        splitType: split.splitType as unknown as CalculationMode,
                        amount: split.amount,
                        feeAmount: split.feeAmount,
                    },
                    new UniqueEntityID(split.id)
                )) || [],
                transactions: raw.invoiceTransaction?.map(transaction => InvoiceTransaction.create(
                    {
                        invoiceId: new UniqueEntityID(raw.id),
                        transactionId: new UniqueEntityID(transaction.transactionId),
                    },
                    new UniqueEntityID(transaction.id)
                )) || [],
                attachments: raw.invoiceAttachment?.map(attachment => InvoiceAttachment.create(
                    {
                        invoiceId: new UniqueEntityID(raw.id),
                        fileId: new UniqueEntityID(attachment.fileId),
                    },
                    new UniqueEntityID(attachment.id)
                )) || [],
                events: raw.invoiceEvent?.map(event => InvoiceEvent.create(
                    {
                        invoiceId: new UniqueEntityID(raw.id),
                        event: event.event,
                        createdAt: event.createdAt,
                    },
                    new UniqueEntityID(event.id)
                )) || [],
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt
            },
            new UniqueEntityID(raw.id)
        )
    }

    static toPrisma(invoice: Invoice): Prisma.InvoiceUncheckedCreateInput & {
        invoiceItem: Prisma.InvoiceItemCreateManyInput[]
        invoiceSplit: Prisma.InvoiceSplitCreateManyInput[]
        invoiceTransaction: Prisma.InvoiceTransactionCreateManyInput[]
        invoiceAttachment: Prisma.InvoiceAttachmentCreateManyInput[]
        invoiceEvent: Prisma.InvoiceEventCreateManyInput[]
    } {
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

            invoiceItem: invoice.items.map(item => ({
                id: item.id.toString(),
                invoiceId: invoice.id.toString(),
                itemId: item.itemId.toString(),
                itemDescription: item.itemDescription,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                discount: item.discount,
                totalPrice: item.totalPrice,
            })),

            invoiceSplit: invoice.splits.map(split => ({
                id: split.id.toString(),
                invoiceId: invoice.id.toString(),
                recipientId: split.recipientId.toString(),
                splitType: split.splitType,
                amount: split.amount,
                feeAmount: split.feeAmount,
            })),

            invoiceTransaction: invoice.transactions.map(transaction => ({
                id: transaction.id.toString(),
                invoiceId: invoice.id.toString(),
                transactionId: transaction.transactionId.toString(),
            })),

            invoiceAttachment: invoice.attachments.map(attachment => ({
                id: attachment.id.toString(),
                invoiceId: invoice.id.toString(),
                fileId: attachment.fileId.toString(),
            })),

            invoiceEvent: invoice.events.map(event => ({
                id: event.id.toString(),
                invoiceId: invoice.id.toString(),
                event: event.event,
                createdAt: event.createdAt,
            })),
        }
    }
}