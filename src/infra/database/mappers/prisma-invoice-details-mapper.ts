import { Invoice as PrismaInvoice, Business as PrismaBusiness, Person as PrismaPerson, InvoiceItem as PrismaInvoiceItem, InvoiceSplit as PrismaInvoiceSplit } from '@prisma/client'
import { InvoiceDetails } from '@/domain/invoice/entities/value-objects/invoice-details'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CalculationMode, InvoiceStatus, YesNo } from '@/core/types/enums'

type PrismaInvoiceWithRelations = PrismaInvoice & {
    business: PrismaBusiness
    person: PrismaPerson
    invoiceItem?: PrismaInvoiceItem[]
    invoiceSplit?: PrismaInvoiceSplit & {
        amount: any
        splitType: any
        recipient: PrismaBusiness
    }[]
}

export class PrismaInvoiceDetailsMapper {
    static toDomain(raw: PrismaInvoiceWithRelations): InvoiceDetails {
        return InvoiceDetails.create({
            // Business data
            businessId: new UniqueEntityID(raw.business.id),
            businessName: raw.business.name,

            // Person data
            personId: new UniqueEntityID(raw.person.id),
            personName: raw.person.name,
            personDocument: raw.person.document,
            personEmail: raw.person.email,

            // Items summary
            itemsCount: raw.invoiceItem?.length ?? 0,
            itemsDetails: raw.invoiceItem?.map(item => ({
                itemId: item.itemId,
                description: item.itemDescription,
                quantity: item.quantity,
                amount: item.totalPrice
            })) ?? [],

            // Splits summary
            splitsCount: raw.invoiceSplit?.length ?? 0,
            splitsDetails: raw.invoiceSplit?.map(split => ({
                recipientId: split.recipient.id,
                recipientName: split.recipient.name,
                splitType: split.splitType,
                amount: split.amount,
                feeAmount: split.amount
            })) ?? [],

            // Invoice data
            description: raw.description,
            notes: raw.notes,
            status: raw.status as InvoiceStatus,

            // Dates
            issueDate: raw.issueDate,
            dueDate: raw.dueDate,
            paymentDate: raw.paymentDate,
            paymentLimitDate: raw.paymentLimitDate,

            // Payment link
            paymentLink: raw.paymentLink,

            // Amounts
            grossAmount: raw.grossAmount,
            discountAmount: raw.discountAmount,
            amount: raw.amount,
            paymentAmount: raw.paymentAmount,

            // Calculation settings
            protestMode: raw.protestMode as unknown as YesNo,
            protestDays: raw.protestDays,
            lateMode: raw.lateMode as unknown as CalculationMode,
            lateValue: raw.lateValue,
            interestMode: raw.interestMode as CalculationMode,
            interestDays: raw.interestDays,
            interestValue: raw.interestValue,
            discountMode: raw.discountMode as CalculationMode,
            discountDays: raw.discountDays,
            discountValue: raw.discountValue,

            // System dates
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        })
    }
}