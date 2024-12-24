import { PaginationParams } from "@/core/repositories/pagination-params"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { InvoiceRepository } from "@/domain/invoice/respositories/invoice-repository"
import { Invoice } from "@/domain/invoice/entities/invoice"
import { InvoiceDetails } from "@/domain/invoice/entities/value-objects/invoice-details"
import { PrismaInvoiceMapper } from "@/infra/database/mappers/prisma-invoice-mapper"
import { Logger } from "@nestjs/common"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InvoiceStatus } from "@/core/types/enums"

@Injectable()
export class PrismaInvoiceRepository implements InvoiceRepository {
    private readonly logger = new Logger(PrismaInvoiceRepository.name);

    constructor(private prisma: PrismaService) { }
    findMany(params: PaginationParams, businessId: string): Promise<Invoice[]> {
        throw new Error("Method not implemented.")
    }

    async findByIdDetails(id: string, businessId: string): Promise<InvoiceDetails | null> {
        throw new Error("Method not implemented.")
    }

    async findById(id: string, businessId: string): Promise<Invoice | null> {
        const invoice = await this.prisma.invoice.findUnique({
            where: {
                id_businessId: {
                    id,
                    businessId,
                }
            },
            include: {
                invoiceItem: true,
                invoiceSplit: true,
                invoiceTransaction: true,
                invoiceAttachment: true,
                invoiceEvent: true,
                invoicePayment: true
            }
        })

        if (!invoice) {
            return null
        }

        return PrismaInvoiceMapper.toDomain(invoice)
    }


    async findByDueDate(
        dueDate: Date,
        status?: InvoiceStatus
    ): Promise<Invoice[]> {
        this.logger.debug(
            `[FindByDueDate] Buscando faturas com vencimento em ${dueDate.toISOString()}`,
            { status }
        );

        // Ajusta a data para considerar todo o dia
        const startDate = new Date(dueDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(dueDate);
        endDate.setHours(23, 59, 59, 999);

        try {
            const invoices = await this.prisma.invoice.findMany({
                where: {
                    dueDate: {
                        gte: startDate,
                        lte: endDate,
                    },
                    ...(status ? { status } : {}),
                },
                include: {
                    person: true,
                    business: true,
                    invoiceItem: true,
                    invoiceSplit: true,
                    invoiceTransaction: true,
                    invoiceAttachment: true,
                    invoiceEvent: true,
                    invoicePayment: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });

            this.logger.debug(`[FindByDueDate] Encontradas ${invoices.length} faturas`);

            return invoices.map(PrismaInvoiceMapper.toDomain);
        } catch (error) {
            this.logger.error('[FindByDueDate] Erro ao buscar faturas:', error);
            throw error;
        }
    }

    async save(invoice: Invoice): Promise<void> {
        const data = PrismaInvoiceMapper.toPrisma(invoice)

        this.logger.debug(`[Save] Buscando fatura ${data.id} do business ${data.businessId}`)

        const currentInvoice = await this.prisma.invoice.findUnique({
            where: {
                id_businessId: {
                    id: data.id,
                    businessId: data.businessId
                }
            },
            include: {
                invoiceItem: true,
                invoiceSplit: true,
                invoiceTransaction: true,
                invoiceAttachment: true,
                invoiceEvent: true,
                invoicePayment: true
            }
        })

        if (!currentInvoice) {
            throw new Error(`Invoice ${data.id} not found for business ${data.businessId}`)
        }

        await this.prisma.$transaction(async (tx) => {
            // Atualiza a fatura principal
            await tx.invoice.update({
                where: {
                    id_businessId: {
                        id: data.id,
                        businessId: data.businessId
                    }
                },
                data: {
                    businessId: data.businessId,
                    personId: data.personId,
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
            const itemsToCreate = data.invoiceItems.filter(
                item => !currentInvoice.invoiceItem.some(
                    current => current.id === item.id
                )
            )

            const itemsToUpdate = data.invoiceItems.filter(
                item => currentInvoice.invoiceItem.some(
                    current => current.id === item.id
                )
            )

            const itemsToDelete = currentInvoice.invoiceItem
                .filter(current => !data.invoiceItems.some(
                    item => item.id === current.id
                ))
                .map(item => item.id)

            if (itemsToCreate.length) {
                await tx.invoiceItem.createMany({
                    data: itemsToCreate.map(item => ({
                        ...item,
                        invoiceId: data.id
                    }))
                })
            }

            for (const item of itemsToUpdate) {
                await tx.invoiceItem.update({
                    where: { id: item.id },
                    data: {
                        itemId: item.itemId,
                        itemDescription: item.itemDescription,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        discount: item.discount,
                        totalPrice: item.totalPrice
                    }
                })
            }

            if (itemsToDelete.length) {
                await tx.invoiceItem.deleteMany({
                    where: { id: { in: itemsToDelete } }
                })
            }

            // Gerenciar Splits
            const splitsToCreate = data.invoiceSplits.filter(
                split => !currentInvoice.invoiceSplit.some(
                    current => current.id === split.id
                )
            )

            const splitsToUpdate = data.invoiceSplits.filter(
                split => currentInvoice.invoiceSplit.some(
                    current => current.id === split.id
                )
            )

            const splitsToDelete = currentInvoice.invoiceSplit
                .filter(current => !data.invoiceSplits.some(
                    split => split.id === current.id
                ))
                .map(split => split.id)

            if (splitsToCreate.length) {
                await tx.invoiceSplit.createMany({
                    data: splitsToCreate.map(split => ({
                        ...split,
                        invoiceId: data.id
                    }))
                })
            }

            for (const split of splitsToUpdate) {
                await tx.invoiceSplit.update({
                    where: { id: split.id },
                    data: {
                        recipientId: split.recipientId,
                        splitType: split.splitType,
                        amount: split.amount,
                        feeAmount: split.feeAmount
                    }
                })
            }

            if (splitsToDelete.length) {
                await tx.invoiceSplit.deleteMany({
                    where: { id: { in: splitsToDelete } }
                })
            }

            // Gerenciar Transactions
            const transactionsToCreate = data.invoiceTransactions.filter(
                transaction => !currentInvoice.invoiceTransaction.some(
                    current => current.id === transaction.id
                )
            )

            if (transactionsToCreate.length) {
                await tx.invoiceTransaction.createMany({
                    data: transactionsToCreate.map(transaction => ({
                        ...transaction,
                        invoiceId: data.id
                    }))
                })
            }

            // Gerenciar Payments
            const paymentsToCreate = data.invoicePayments.filter(
                payment => !currentInvoice.invoicePayment.some(
                    current => current.id === payment.id
                )
            )

            const paymentsToUpdate = data.invoicePayments.filter(
                payment => currentInvoice.invoicePayment.some(
                    current => current.id === payment.id
                )
            )

            if (paymentsToCreate.length) {
                await tx.invoicePayment.createMany({
                    data: paymentsToCreate.map(payment => ({
                        id: payment.id,
                        invoiceId: data.id,
                        dueDate: payment.dueDate,
                        ammount: payment.amount,
                        paymentMethod: payment.paymentMethod
                    }))
                })
            }

            for (const payment of paymentsToUpdate) {
                await tx.invoicePayment.update({
                    where: { id: payment.id },
                    data: {
                        dueDate: payment.dueDate,
                        ammount: payment.amount,
                        paymentMethod: payment.paymentMethod
                    }
                })
            }

            // Gerenciar Events (append only)
            const eventsToCreate = data.invoiceEvents.filter(
                event => !currentInvoice.invoiceEvent.some(
                    current => current.id === event.id
                )
            )

            if (eventsToCreate.length) {
                await tx.invoiceEvent.createMany({
                    data: eventsToCreate.map(event => ({
                        ...event,
                        invoiceId: data.id
                    }))
                })
            }
        })

        this.logger.debug(`[Save] Fatura ${data.id} atualizada com sucesso`)
    }

    async create(invoice: Invoice): Promise<void> {
        const data = PrismaInvoiceMapper.toPrisma(invoice)

        this.logger.debug(`[Create] Criando nova fatura ${data.id}`)

        try {
            await this.prisma.invoice.create({
                data: {
                    id: data.id,
                    businessId: data.businessId,
                    personId: data.personId,
                    description: data.description,
                    notes: data.notes,
                    paymentLink: data.paymentLink,
                    status: data.status,
                    issueDate: data.issueDate,
                    dueDate: data.dueDate,
                    paymentDate: data.paymentDate || null,
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
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,

                    invoiceItem: {
                        createMany: {
                            data: data.invoiceItems.map(item => ({
                                id: item.id,
                                itemId: item.itemId,
                                itemDescription: item.itemDescription,
                                quantity: item.quantity,
                                unitPrice: item.unitPrice,
                                discount: item.discount,
                                totalPrice: item.totalPrice
                            }))
                        }
                    },

                    invoiceSplit: {
                        createMany: {
                            data: data.invoiceSplits.map(split => ({
                                id: split.id,
                                recipientId: split.recipientId,
                                splitType: split.splitType,
                                amount: split.amount,
                                feeAmount: split.feeAmount
                            }))
                        }
                    },

                    invoiceTransaction: {
                        createMany: {
                            data: data.invoiceTransactions.map(transaction => ({
                                id: transaction.id,
                                transactionId: transaction.transactionId
                            }))
                        }
                    },

                    invoiceEvent: {
                        createMany: {
                            data: data.invoiceEvents.map(event => ({
                                id: event.id,
                                event: event.event,
                                createdAt: event.createdAt
                            }))
                        }
                    },

                    invoicePayment: {
                        createMany: {
                            data: data.invoicePayments.map(payment => ({
                                id: payment.id,
                                dueDate: payment.dueDate,
                                ammount: payment.amount,
                                paymentMethod: payment.paymentMethod
                            }))
                        }
                    }
                }
            })

            this.logger.debug(`[Create] Fatura ${data.id} criada com sucesso`)

        } catch (error) {
            this.logger.error(`[Create] Erro ao criar fatura ${data.id}:`, error)
            throw error
        }
    }
}