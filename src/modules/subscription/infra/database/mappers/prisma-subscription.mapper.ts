import { UniqueEntityID } from '@/core/domain/entity/unique-entity-id'
import { Subscription } from '@/modules/subscription/domain/entities/subscription'
import { SubscriptionItem } from '@/modules/subscription/domain/entities/subscription-item'
import { SubscriptionSplit } from '@/modules/subscription/domain/entities/subscription-split'
import { SubscriptionNFSe } from '@/modules/subscription/domain/entities/subscription-nfse'
import { SplitType, SubscriptionStatus } from '@/core/utils/enums'
import {
    Subscription as PrismaSubscription,
    SubscriptionItem as PrismaSubscriptionItem,
    SubscriptionSplit as PrismaSubscriptionSplit,
    SubscriptionNFSe as PrismaSubscriptionNFSe,
    Prisma,
    SplitType as PrismaSplitType
} from '@prisma/client'

export class PrismaSubscriptionMapper {

    static toDomain(raw: PrismaSubscription & {
        subscriptionItem?: PrismaSubscriptionItem[]
        subscriptionSplit?: PrismaSubscriptionSplit[]
        subscriptionNFSe?: PrismaSubscriptionNFSe[]
    }): Subscription {
        const subscriptionId = new UniqueEntityID(raw.id);

        return Subscription.create(
            {
                businessId: new UniqueEntityID(raw.businessId),
                personId: new UniqueEntityID(raw.personId),
                price: raw.price,
                notes: raw.notes,
                paymentMethod: raw.paymentMethod,
                interval: raw.interval,
                status: raw.status as unknown as SubscriptionStatus,
                nextBillingDate: raw.nextBillingDate,
                nextAdjustmentDate: raw.nextAdjustmentDate,
                cancellationReason: raw.cancellationReason,
                cancellationDate: raw.cancellationDate,
                cancellationScheduledDate: raw.cancellationScheduledDate,
                items: raw.subscriptionItem?.map(item => SubscriptionItem.create(
                    {
                        subscriptionId: subscriptionId, // Adicionado
                        itemId: new UniqueEntityID(item.itemId),
                        itemDescription: item.itemDescription,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        totalPrice: item.totalPrice,
                        status: item.status,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt
                    },
                    new UniqueEntityID(item.id)
                )) || [],
                splits: raw.subscriptionSplit?.map(split => SubscriptionSplit.create(
                    {
                        subscriptionId: subscriptionId, // Adicionado
                        recipientId: new UniqueEntityID(split.recipientId),
                        splitType: split.splitType as unknown as SplitType,
                        amount: split.amount,
                        feeAmount: split.feeAmount,
                    },
                    new UniqueEntityID(split.id)
                )) || [],
                nfse: raw.subscriptionNFSe?.[0] ? SubscriptionNFSe.create(
                    {
                        subscriptionId: subscriptionId, // Adicionado
                        serviceCode: raw.subscriptionNFSe[0].serviceCode,
                        issRetention: raw.subscriptionNFSe[0].issRetention,
                        inssRetention: raw.subscriptionNFSe[0].inssRetention,
                        inssRate: raw.subscriptionNFSe[0].inssRate ?? undefined,
                        incidendeState: raw.subscriptionNFSe[0].incidendeState,
                        indicendeCity: raw.subscriptionNFSe[0].indicendeCity,
                        retentionState: raw.subscriptionNFSe[0].retentionState,
                        retentionCity: raw.subscriptionNFSe[0].retentionCity,
                        status: raw.subscriptionNFSe[0].status,
                        createdAt: raw.subscriptionNFSe[0].createdAt,
                        updatedAt: raw.subscriptionNFSe[0].updatedAt
                    },
                    new UniqueEntityID(raw.subscriptionNFSe[0].id)
                ) : null,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt
            },
            new UniqueEntityID(raw.id)
        )
    }

    static toPrisma(subscription: Subscription) {
        return {
            id: subscription.id.toString(),
            businessId: subscription.businessId.toString(),
            personId: subscription.personId.toString(),
            price: subscription.price,
            notes: subscription.notes,
            paymentMethod: subscription.paymentMethod,
            interval: subscription.interval,
            status: subscription.status,
            nextBillingDate: subscription.nextBillingDate,
            nextAdjustmentDate: subscription.nextAdjustmentDate,
            cancellationReason: subscription.cancellationReason,
            cancellationDate: subscription.cancellationDate,
            cancellationScheduledDate: subscription.cancellationScheduledDate,
            createdAt: subscription.createdAt,
            updatedAt: subscription.updatedAt,
            // Mudamos para retornar os arrays diretamente
            subscriptionItems: subscription.items.map(item => ({
                id: item.id.toString(),
                itemId: item.id.toString(),
                itemDescription: item.itemDescription,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                status: item.status,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
            })),
            subscriptionSplits: subscription.splits.map(split => ({
                id: split.id.toString(),
                recipientId: split.recipientId.toString(),
                splitType: split.splitType as unknown as PrismaSplitType,
                amount: split.amount,
                feeAmount: split.feeAmount,
            })),
            subscriptionNFSe: subscription.nfse ? {
                id: subscription.nfse.id.toString(),
                serviceCode: subscription.nfse.serviceCode,
                issRetention: subscription.nfse.issRetention,
                inssRetention: subscription.nfse.inssRetention,
                inssRate: subscription.nfse.inssRate,
                incidendeState: subscription.nfse.incidendeState,
                indicendeCity: subscription.nfse.indicendeCity,
                retentionState: subscription.nfse.retentionState,
                retentionCity: subscription.nfse.retentionCity,
                status: subscription.nfse.status,
                createdAt: subscription.nfse.createdAt,
                updatedAt: subscription.nfse.updatedAt,
            } : null
        }
    }
}