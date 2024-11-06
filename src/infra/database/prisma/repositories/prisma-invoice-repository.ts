import { PaginationParams } from "@/core/repositories/pagination-params"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { InvoiceRepository } from "@/domain/invoice/respositories/invoice-repository"
import { Invoice } from "@/domain/invoice/entities/invoice"
import { InvoiceDetails } from "@/domain/invoice/entities/value-objects/invoice-details"
import { PrismaInvoiceMapper } from "@/infra/database/mappers/prisma-invoice-mapper"
//import { PrismaInvoiceDetailsMapper } from "@/infra/database/mappers/prisma-invoice-details-mapper"

@Injectable()
export class PrismaInvoiceRepository implements InvoiceRepository {
    constructor(private prisma: PrismaService) { }

    findByIdDetails(id: string, businessId: string): Promise<InvoiceDetails | null> {
        throw new Error("Method not implemented.")
    }

    async findById(id: string, businessId: string): Promise<Invoice | null> {
        const invoice = await this.prisma.invoice.findUnique({
            where: {
                id,
                businessId,
            },
            include: {
                invoiceItem: true,
                invoiceSplit: true,
                invoiceTransaction: true,
                invoiceAttachment: true,
                invoiceEvent: true
            }
        })

        if (!invoice) {
            return null
        }

        return PrismaInvoiceMapper.toDomain(invoice)
    }

    async findMany({ page }: PaginationParams, businessId: string): Promise<Invoice[]> {
        const invoices = await this.prisma.invoice.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            where: {
                businessId,
            },
            include: {
                invoiceItem: true,
                invoiceSplit: true,
                invoiceTransaction: true,
                invoiceAttachment: true,
                invoiceEvent: true
            },
            skip: (page - 1) * 20,
        })

        return invoices.map(PrismaInvoiceMapper.toDomain)
    }

    async save(invoice: Invoice): Promise<void> {
        const data = PrismaInvoiceMapper.toPrisma(invoice)

        // Buscar estado atual da invoice no banco
        const currentInvoice = await this.prisma.invoice.findUnique({
            where: { id: data.id },
            include: {
                invoiceItem: true,
                invoiceSplit: true,
                invoiceTransaction: true,
                invoiceAttachment: true,
                invoiceEvent: true
            }
        })

        if (!currentInvoice) {
            throw new Error('Invoice not found')
        }

        await this.prisma.$transaction(async (tx) => {
            // Atualizar invoice
            await tx.invoice.update({
                where: { id: data.id },
                data: {
                    description: data.description,
                    notes: data.notes,
                    paymentLink: data.paymentLink,
                    status: data.status,
                    issueDate: data.issueDate,
                    dueDate: data.dueDate,
                    paymentDate: data.paymentDate,
                    paymentLimitDate: data.paymentLimitDate,
                    grossAmount: data.grossAmount,
                    discountAmount: data.discountAmount,
                    amount: data.amount,
                    paymentAmount: data.paymentAmount,
                    protestMode: data.protestMode,
                    protestDays: data.protestDays,
                    lateMode: data.lateMode,
                    lateValue: data.lateValue,
                    interestMode: data.interestMode,
                    interestDays: data.interestDays,
                    interestValue: data.interestValue,
                    discountMode: data.discountMode,
                    discountDays: data.discountDays,
                    discountValue: data.discountValue,
                    updatedAt: data.updatedAt
                }
            })

            // Gerenciar Items
            if (data.invoiceItem) {
                const itemsToCreate = data.invoiceItem.filter(
                    item => !currentInvoice.invoiceItem.some(current => current.id === item.id)
                )
                const itemsToUpdate = data.invoiceItem.filter(
                    item => currentInvoice.invoiceItem.some(current => current.id === item.id)
                )
                const itemsToDelete = currentInvoice.invoiceItem
                    .filter(current => !data.invoiceItem.some(item => item.id === current.id))
                    .map(item => item.id)

                // Criar novos items
                if (itemsToCreate.length) {
                    await tx.invoiceItem.createMany({ data: itemsToCreate })
                }

                // Atualizar items existentes
                for (const item of itemsToUpdate) {
                    await tx.invoiceItem.update({
                        where: { id: item.id },
                        data: item
                    })
                }

                // Deletar items removidos
                if (itemsToDelete.length) {
                    await tx.invoiceItem.deleteMany({
                        where: { id: { in: itemsToDelete } }
                    })
                }
            }

            // Gerenciar Splits
            if (data.invoiceSplit) {
                const splitsToCreate = data.invoiceSplit.filter(
                    split => !currentInvoice.invoiceSplit.some(current => current.id === split.id)
                )
                const splitsToUpdate = data.invoiceSplit.filter(
                    split => currentInvoice.invoiceSplit.some(current => current.id === split.id)
                )
                const splitsToDelete = currentInvoice.invoiceSplit
                    .filter(current => !data.invoiceSplit.some(split => split.id === current.id))
                    .map(split => split.id)

                if (splitsToCreate.length) {
                    await tx.invoiceSplit.createMany({ data: splitsToCreate })
                }

                for (const split of splitsToUpdate) {
                    await tx.invoiceSplit.update({
                        where: { id: split.id },
                        data: split
                    })
                }

                if (splitsToDelete.length) {
                    await tx.invoiceSplit.deleteMany({
                        where: { id: { in: splitsToDelete } }
                    })
                }
            }

            // Gerenciar Transactions
            if (data.invoiceTransaction) {
                const transactionsToCreate = data.invoiceTransaction.filter(
                    trans => !currentInvoice.invoiceTransaction.some(current => current.id === trans.id)
                )
                const transactionsToDelete = currentInvoice.invoiceTransaction
                    .filter(current => !data.invoiceTransaction.some(trans => trans.id === current.id))
                    .map(trans => trans.id)

                if (transactionsToCreate.length) {
                    await tx.invoiceTransaction.createMany({ data: transactionsToCreate })
                }

                if (transactionsToDelete.length) {
                    await tx.invoiceTransaction.deleteMany({
                        where: { id: { in: transactionsToDelete } }
                    })
                }
            }

            // Gerenciar Attachments
            if (data.invoiceAttachment) {
                const attachmentsToCreate = data.invoiceAttachment.filter(
                    attach => !currentInvoice.invoiceAttachment.some(current => current.id === attach.id)
                )
                const attachmentsToDelete = currentInvoice.invoiceAttachment
                    .filter(current => !data.invoiceAttachment.some(attach => attach.id === current.id))
                    .map(attach => attach.id)

                if (attachmentsToCreate.length) {
                    await tx.invoiceAttachment.createMany({ data: attachmentsToCreate })
                }

                if (attachmentsToDelete.length) {
                    await tx.invoiceAttachment.deleteMany({
                        where: { id: { in: attachmentsToDelete } }
                    })
                }
            }

            // Sempre adicionar novos eventos
            if (data.invoiceEvent?.length) {
                await tx.invoiceEvent.createMany({
                    data: data.invoiceEvent
                })
            }
        })
    }

    async create(invoice: Invoice): Promise<void> {
        const data = PrismaInvoiceMapper.toPrisma(invoice)

        await this.prisma.invoice.create({
            data: {
                ...data,
                invoiceItem: {
                    create: data.invoiceItem
                },
                invoiceSplit: {
                    create: data.invoiceSplit
                },
                invoiceTransaction: {
                    create: data.invoiceTransaction
                },
                invoiceAttachment: {
                    create: data.invoiceAttachment
                },
                invoiceEvent: {
                    create: data.invoiceEvent
                }
            },
        })
    }

    // async delete(invoice: Invoice): Promise<void> {
    //     const data = PrismaInvoiceMapper.toPrisma(invoice)

    //     await this.prisma.$transaction([
    //         // Deletar registros relacionados
    //         this.prisma.invoiceItem.deleteMany({
    //             where: { invoiceId: data.id }
    //         }),
    //         this.prisma.invoiceSplit.deleteMany({
    //             where: { invoiceId: data.id }
    //         }),
    //         this.prisma.invoiceTransaction.deleteMany({
    //             where: { invoiceId: data.id }
    //         }),
    //         this.prisma.invoiceAttachment.deleteMany({
    //             where: { invoiceId: data.id }
    //         }),
    //         this.prisma.invoiceEvent.deleteMany({
    //             where: { invoiceId: data.id }
    //         }),

    //         // Deletar a invoice
    //         this.prisma.invoice.delete({
    //             where: {
    //                 id: data.id,
    //             }
    //         })
    //     ])
    // }
}