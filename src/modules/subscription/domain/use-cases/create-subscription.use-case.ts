import { Subscription } from '@/core/domain/entities/subscription.entity'
import { SubscriptionItem } from '@/core/domain/entities/subscription-item.entity'
import { SubscriptionSplit } from '@/core/domain/entities/subscription-split.entity'
import { SubscriptionNFSe } from '@/core/domain/entities/subscription-nfse.entity'
import { SubscriptionRepository } from '@/core/domain/repositories/subscription-repository'
import { Injectable } from '@nestjs/common'

import { Either, right, left } from @core/co@core/either'
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id'
import { AppError } from @core/co@core/erro@core/app-errors'
import { Language } from @core/i18n'


interface CreateSubscriptionUseCaseRequest {
    businessId: string
    personId: string
    price: number
    notes?: string | null
    paymentMethod: string
    nextBillingDate: Date
    nextAdjustmentDate?: Date | null
    interval: string
    items: {
        itemId: string
        itemDescription: string
        quantity: number
        unitPrice: number
        totalPrice: number
        status: string
    }[]
    splits?: {
        recipientId: string
        splitType: string
        amount: number
        feeAmount: number
    }[]
    nfse?: {
        serviceCode: string
        issRetention: boolean
        inssRetention: boolean
        inssRate?: number
        incidendeState: string
        indicendeCity: string
        retentionState: string
        retentionCity: string
    }
}

type CreateSubscriptionUseCaseResponse = Either<
    AppError,
    {
        subscription: Subscription
        message: string
    }
>

@Injectable()
export class CreateSubscriptionUseCase {
    constructor(
        private subscriptionRepository: SubscriptionRepository,
    ) { }

    async execute(
        input: CreateSubscriptionUseCaseRequest,
        language: Language = 'pt-BR'
    ): Promise<CreateSubscriptionUseCaseResponse> {
        const {
            businessId,
            personId,
            price,
            notes,
            paymentMethod,
            nextBillingDate,
            nextAdjustmentDate,
            interval,
            items,
            splits,
            nfse,
        } = input

      @core// 1. Criar a assinatura
        const subscription = Subscription.create({
            businessId: new UniqueEntityID(businessId),
            personId: new UniqueEntityID(personId),
            price,
            notes,
            paymentMethod,
            nextBillingDate,
            nextAdjustmentDate,
            interval,
        })

      @core// 2. Adicionar os itens
        items.forEach(item => {
            const subscriptionItem = SubscriptionItem.create({
                subscriptionId: subscription.id,
                itemId: new UniqueEntityID(item.itemId),
                itemDescription: item.itemDescription,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                status: item.status,
                createdAt: new Date(),
            })

            subscription.addItem(subscriptionItem)
        })

      @core// 3. Adicionar os splits (se existirem)
        if (splits) {
            splits.forEach(split => {
                const subscriptionSplit = SubscriptionSplit.create({
                    subscriptionId: subscription.id,
                    recipientId: new UniqueEntityID(split.recipientId),
                    splitType: split.splitType as any,
                    amount: split.amount,
                    feeAmount: split.feeAmount,
                })

                subscription.addSplit(subscriptionSplit)
            })
        }

      @core// 4. Adicionar NFSe (se existir)
        if (nfse) {
            const subscriptionNFSe = SubscriptionNFSe.create({
                subscriptionId: subscription.id,
                serviceCode: nfse.serviceCode,
                issRetention: nfse.issRetention,
                inssRetention: nfse.inssRetention,
                inssRate: nfse.inssRate,
                incidendeState: nfse.incidendeState,
                indicendeCity: nfse.indicendeCity,
                retentionState: nfse.retentionState,
                retentionCity: nfse.retentionCity,
                status: 'ACTIVE',
                createdAt: new Date(),
            })

            subscription.setNFSe(subscriptionNFSe)
        }

      @core// 5. Persistir a assinatura
        await this.subscriptionRepository.create(subscription)

        return right({
            subscription,
            message: 'Subscription created successfully',
        })
    }
}