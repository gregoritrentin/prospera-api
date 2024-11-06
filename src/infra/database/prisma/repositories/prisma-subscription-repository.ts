import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { PaginationParams } from "@/core/repositories/pagination-params"
import { SubscriptionRepository } from "@/domain/subscription/repositories/subscription-repository"
import { Subscription } from "@/domain/subscription/entities/subscription"
import { SubscriptionDetails } from "@/domain/subscription/entities/value-objects/subscription-details"
import { PrismaSubscriptionMapper } from "@/infra/database/mappers/prisma-subscription-mapper"

@Injectable()
export class PrismaSubscriptionRepository implements SubscriptionRepository {
    constructor(private prisma: PrismaService) { }

    async findByIdDetails(id: string, businessId: string): Promise<SubscriptionDetails | null> {
        throw new Error("Method not implemented.")
    }

    async findById(id: string, businessId: string): Promise<Subscription | null> {
        const subscription = await this.prisma.subscription.findUnique({
            where: {
                id,
                businessId,
            },
            include: {
                subscriptionItem: true,
                subscriptionSplit: true,
                subscriptionNFSe: true
            }
        })

        if (!subscription) {
            return null
        }

        return PrismaSubscriptionMapper.toDomain(subscription)
    }

    async findMany({ page }: PaginationParams, businessId: string): Promise<Subscription[]> {
        const subscriptions = await this.prisma.subscription.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            where: {
                businessId,
            },
            include: {
                subscriptionItem: true,
                subscriptionSplit: true,
                subscriptionNFSe: true
            },
            skip: (page - 1) * 20,
        })

        return subscriptions.map(PrismaSubscriptionMapper.toDomain)
    }

    async findManyToInvoiceByDate(date: Date, businessId: string): Promise<Subscription[]> {
        const subscriptions = await this.prisma.subscription.findMany({
            where: {
                businessId,
                nextBillingDate: {
                    equals: date,
                },
                status: 'ACTIVE',
                OR: [
                    { cancellationDate: null },
                    {
                        cancellationScheduledDate: {
                            gt: date, // Data de cancelamento programada maior que a data de faturamento
                        },
                    },
                ],
            },
            include: {
                subscriptionItem: true,
                subscriptionSplit: true,
                subscriptionNFSe: true
            },
            orderBy: {
                createdAt: 'desc',
            },
        })

        return subscriptions.map(PrismaSubscriptionMapper.toDomain)
    }

    async save(subscription: Subscription): Promise<void> {
        const data = PrismaSubscriptionMapper.toPrisma(subscription)

        // Buscar estado atual da subscription no banco
        const currentSubscription = await this.prisma.subscription.findUnique({
            where: { id: data.id },
            include: {
                subscriptionItem: true,
                subscriptionSplit: true,
                subscriptionNFSe: true
            }
        })

        if (!currentSubscription) {
            throw new Error('Subscription not found')
        }

        await this.prisma.$transaction(async (tx) => {
            // Atualizar subscription
            await tx.subscription.update({
                where: { id: data.id },
                data: {
                    businessId: data.businessId,
                    personId: data.personId,
                    price: data.price,
                    notes: data.notes,
                    paymentMethod: data.paymentMethod,
                    nextBillingDate: data.nextBillingDate,
                    interval: data.interval,
                    status: data.status,
                    nextAdjustmentDate: data.nextAdjustmentDate,
                    cancellationDate: data.cancellationDate,
                    cancellationReason: data.cancellationReason,
                    cancellationScheduledDate: data.cancellationScheduledDate,
                    updatedAt: data.updatedAt
                }
            })

            // Gerenciar Items
            if (data.subscriptionItem) {
                const itemsToCreate = data.subscriptionItem.filter(
                    item => !currentSubscription.subscriptionItem.some(current => current.id === item.id)
                )
                const itemsToUpdate = data.subscriptionItem.filter(
                    item => currentSubscription.subscriptionItem.some(current => current.id === item.id)
                )
                const itemsToDelete = currentSubscription.subscriptionItem
                    .filter(current => !data.subscriptionItem.some(item => item.id === current.id))
                    .map(item => item.id)

                if (itemsToCreate.length) {
                    await tx.subscriptionItem.createMany({ data: itemsToCreate })
                }

                for (const item of itemsToUpdate) {
                    await tx.subscriptionItem.update({
                        where: { id: item.id },
                        data: item
                    })
                }

                if (itemsToDelete.length) {
                    await tx.subscriptionItem.deleteMany({
                        where: { id: { in: itemsToDelete } }
                    })
                }
            }

            // Gerenciar Splits
            if (data.subscriptionSplit) {
                const splitsToCreate = data.subscriptionSplit.filter(
                    split => !currentSubscription.subscriptionSplit.some(current => current.id === split.id)
                )
                const splitsToUpdate = data.subscriptionSplit.filter(
                    split => currentSubscription.subscriptionSplit.some(current => current.id === split.id)
                )
                const splitsToDelete = currentSubscription.subscriptionSplit
                    .filter(current => !data.subscriptionSplit.some(split => split.id === current.id))
                    .map(split => split.id)

                if (splitsToCreate.length) {
                    await tx.subscriptionSplit.createMany({ data: splitsToCreate })
                }

                for (const split of splitsToUpdate) {
                    await tx.subscriptionSplit.update({
                        where: { id: split.id },
                        data: split
                    })
                }

                if (splitsToDelete.length) {
                    await tx.subscriptionSplit.deleteMany({
                        where: { id: { in: splitsToDelete } }
                    })
                }
            }

            // Gerenciar NFSe
            if (data.subscriptionNFSe.length > 0) {
                const nfse = data.subscriptionNFSe[0]
                const currentNFSe = currentSubscription.subscriptionNFSe[0]

                if (currentNFSe) {
                    // Atualizar NFSe existente
                    if (currentNFSe.id === nfse.id) {
                        await tx.subscriptionNFSe.update({
                            where: { id: nfse.id },
                            data: nfse
                        })
                    } else {
                        // Deletar antigo e criar novo
                        await tx.subscriptionNFSe.delete({
                            where: { id: currentNFSe.id }
                        })
                        await tx.subscriptionNFSe.create({
                            data: nfse
                        })
                    }
                } else {
                    // Criar novo NFSe
                    await tx.subscriptionNFSe.create({
                        data: nfse
                    })
                }
            } else if (currentSubscription.subscriptionNFSe.length > 0) {
                // Deletar NFSe se foi removido
                await tx.subscriptionNFSe.delete({
                    where: { id: currentSubscription.subscriptionNFSe[0].id }
                })
            }
        })
    }

    async create(subscription: Subscription): Promise<void> {
        const data = PrismaSubscriptionMapper.toPrisma(subscription)

        await this.prisma.subscription.create({
            data: {
                ...data,
                subscriptionItem: {
                    createMany: {
                        data: data.subscriptionItem
                    }
                },
                subscriptionSplit: {
                    createMany: {
                        data: data.subscriptionSplit
                    }
                },
                subscriptionNFSe: data.subscriptionNFSe.length > 0 ? {
                    create: data.subscriptionNFSe[0]
                } : undefined
            }
        })
    }
}