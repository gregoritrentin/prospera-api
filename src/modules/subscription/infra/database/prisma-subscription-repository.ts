import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { PaginationParams } from "@core/domain/repository/pagination-params"
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

    async findManyByNextBillingDateRange(startDate: Date, endDate: Date): Promise<Subscription[]> {
        const subscriptions = await this.prisma.subscription.findMany({
            where: {
                nextBillingDate: {
                    gte: startDate,
                    lte: endDate,
                },
                status: 'ACTIVE',
                OR: [
                    { cancellationDate: null },
                    {
                        cancellationScheduledDate: {
                            gt: endDate,
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
                nextBillingDate: 'asc',
            },
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
                            gt: date,
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
            // Atualizar subscription principal
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

            // Log dos itens atuais
            console.log('Current subscription items:', currentSubscription.subscriptionItem)
            console.log('New subscription items:', data.subscriptionItems)

            // Gerenciar Items
            const itemsToCreate = data.subscriptionItems.filter(
                item => !currentSubscription.subscriptionItem.some(
                    current => current.id === item.id
                )
            )

            const itemsToUpdate = data.subscriptionItems.filter(
                item => currentSubscription.subscriptionItem.some(
                    current => current.id === item.id
                )
            )

            console.log('Items to create:', itemsToCreate)
            console.log('Items to update:', itemsToUpdate)

            // Verificar se os itemIds existem antes de criar/atualizar
            const allItemIds = [...new Set([
                ...itemsToCreate.map(item => item.itemId),
                ...itemsToUpdate.map(item => item.itemId)
            ])]

            const existingItems = await tx.item.findMany({
                where: {
                    id: {
                        in: allItemIds.map(id => id.toString())
                    }
                },
                select: { id: true }
            })

            console.log('Existing items in database:', existingItems)

            const validItemIds = new Set(existingItems.map(item => item.id))

            // Filtrar apenas itens válidos
            const validItemsToCreate = itemsToCreate.filter(item =>
                validItemIds.has(item.itemId.toString())
            )

            const validItemsToUpdate = itemsToUpdate.filter(item =>
                validItemIds.has(item.itemId.toString())
            )

            if (validItemsToCreate.length) {
                await tx.subscriptionItem.createMany({
                    data: validItemsToCreate.map(item => ({
                        ...item,
                        subscriptionId: data.id,
                        itemId: item.itemId.toString()
                    }))
                })
            }

            for (const item of validItemsToUpdate) {
                console.log('Updating item:', item)
                try {
                    await tx.subscriptionItem.update({
                        where: { id: item.id },
                        data: {
                            itemId: item.itemId.toString(),
                            itemDescription: item.itemDescription,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            totalPrice: item.totalPrice,
                            status: item.status,
                            updatedAt: item.updatedAt
                        }
                    })
                } catch (error) {
                    console.error('Error updating item:', item)
                    console.error('Error details:', error)
                    throw error
                }
            }

            const itemsToDelete = currentSubscription.subscriptionItem
                .filter(current => !data.subscriptionItems.some(
                    item => item.id === current.id
                ))
                .map(item => item.id)

            if (itemsToDelete.length) {
                await tx.subscriptionItem.deleteMany({
                    where: { id: { in: itemsToDelete } }
                })
            }

            // Gerenciar Splits
            const splitsToCreate = data.subscriptionSplits.filter(
                split => !currentSubscription.subscriptionSplit.some(
                    current => current.id === split.id
                )
            )

            const splitsToUpdate = data.subscriptionSplits.filter(
                split => currentSubscription.subscriptionSplit.some(
                    current => current.id === split.id
                )
            )

            const splitsToDelete = currentSubscription.subscriptionSplit
                .filter(current => !data.subscriptionSplits.some(
                    split => split.id === current.id
                ))
                .map(split => split.id)

            if (splitsToCreate.length) {
                await tx.subscriptionSplit.createMany({
                    data: splitsToCreate.map(split => ({
                        ...split,
                        subscriptionId: data.id
                    }))
                })
            }

            for (const split of splitsToUpdate) {
                await tx.subscriptionSplit.update({
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
                await tx.subscriptionSplit.deleteMany({
                    where: { id: { in: splitsToDelete } }
                })
            }

            // Gerenciar NFSe
            const currentNFSe = currentSubscription.subscriptionNFSe[0]

            if (data.subscriptionNFSe) {
                if (currentNFSe) {
                    if (currentNFSe.id === data.subscriptionNFSe.id) {
                        await tx.subscriptionNFSe.update({
                            where: { id: data.subscriptionNFSe.id },
                            data: {
                                serviceCode: data.subscriptionNFSe.serviceCode,
                                issRetention: data.subscriptionNFSe.issRetention,
                                inssRetention: data.subscriptionNFSe.inssRetention,
                                inssRate: data.subscriptionNFSe.inssRate,
                                incidendeState: data.subscriptionNFSe.incidendeState,
                                indicendeCity: data.subscriptionNFSe.indicendeCity,
                                retentionState: data.subscriptionNFSe.retentionState,
                                retentionCity: data.subscriptionNFSe.retentionCity,
                                status: data.subscriptionNFSe.status,
                                updatedAt: data.subscriptionNFSe.updatedAt
                            }
                        })
                    } else {
                        await tx.subscriptionNFSe.delete({
                            where: { id: currentNFSe.id }
                        })
                        await tx.subscriptionNFSe.create({
                            data: {
                                ...data.subscriptionNFSe,
                                subscriptionId: data.id
                            }
                        })
                    }
                } else {
                    await tx.subscriptionNFSe.create({
                        data: {
                            ...data.subscriptionNFSe,
                            subscriptionId: data.id
                        }
                    })
                }
            } else if (currentNFSe) {
                await tx.subscriptionNFSe.delete({
                    where: { id: currentNFSe.id }
                })
            }
        })
    }

    async create(subscription: Subscription): Promise<void> {
        const data = PrismaSubscriptionMapper.toPrisma(subscription)

        await this.prisma.subscription.create({
            data: {
                //id: data.id,
                businessId: data.businessId,
                personId: data.personId,
                price: data.price,
                notes: data.notes,
                paymentMethod: data.paymentMethod,
                interval: data.interval,
                status: data.status,
                nextBillingDate: data.nextBillingDate,
                nextAdjustmentDate: data.nextAdjustmentDate,
                cancellationReason: data.cancellationReason,
                cancellationDate: data.cancellationDate,
                cancellationScheduledDate: data.cancellationScheduledDate,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
                subscriptionItem: {
                    createMany: {
                        data: data.subscriptionItems
                    }
                },
                subscriptionSplit: {
                    createMany: {
                        data: data.subscriptionSplits
                    }
                },
                subscriptionNFSe: data.subscriptionNFSe ? {
                    create: {
                        //id: data.subscriptionNFSe.id,
                        serviceCode: data.subscriptionNFSe.serviceCode,
                        issRetention: data.subscriptionNFSe.issRetention,
                        inssRetention: data.subscriptionNFSe.inssRetention,
                        inssRate: data.subscriptionNFSe.inssRate,
                        incidendeState: data.subscriptionNFSe.incidendeState,
                        indicendeCity: data.subscriptionNFSe.indicendeCity,
                        retentionState: data.subscriptionNFSe.retentionState,
                        retentionCity: data.subscriptionNFSe.retentionCity,
                        status: data.subscriptionNFSe.status,
                        createdAt: data.subscriptionNFSe.createdAt,
                        updatedAt: data.subscriptionNFSe.updatedAt
                    }
                } : undefined
            }
        })
    }
}