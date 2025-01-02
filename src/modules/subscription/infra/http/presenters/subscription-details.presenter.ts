import { Subscription } from "@/modules/subscripti/domain/entiti/subscription"
import { SubscriptionItem } from "@/modules/subscripti/domain/entiti/subscription-item"
import { SubscriptionSplit } from "@/modules/subscripti/domain/entiti/subscription-split"
import { SubscriptionNFSe } from "@/modules/subscripti/domain/entiti/subscription-nfse"

export class SubscriptionItemPresenter {
    static toHttp(item: SubscriptionItem) {
        return {
            id: item.id.toString(),
            itemId: item.itemId.toString(),
            itemDescription: item.itemDescription,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
        }
    }
}

export class SubscriptionSplitPresenter {
    static toHttp(split: SubscriptionSplit) {
        return {
            id: split.id.toString(),
            recipientId: split.recipientId.toString(),
            splitType: split.splitType,
            amount: split.amount,
            feeAmount: split.feeAmount
        }
    }
}

export class SubscriptionNFSePresenter {
    static toHttp(nfse: SubscriptionNFSe) {
        return {
            id: nfse.id.toString(),
            serviceCode: nfse.serviceCode,
            issRetention: nfse.issRetention,
            inssRetention: nfse.inssRetention,
            inssRate: nfse.inssRate,
            incidendeState: nfse.incidendeState,
            indicendeCity: nfse.indicendeCity,
            retentionState: nfse.retentionState,
            retentionCity: nfse.retentionCity,
            status: nfse.status,
            createdAt: nfse.createdAt,
            updatedAt: nfse.updatedAt
        }
    }
}

export class SubscriptionDetailsPresenter {
    static toHttp(subscription: Subscription) {
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

            items: subscription.items.map(SubscriptionItemPresenter.toHttp),
            splits: subscription.splits.map(SubscriptionSplitPresenter.toHttp),
            nfse: subscription.nfse ? SubscriptionNFSePresenter.toHttp(subscription.nfse) : null
        }
    }
}