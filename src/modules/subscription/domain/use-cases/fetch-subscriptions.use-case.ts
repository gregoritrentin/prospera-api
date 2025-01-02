import { TransactionRepository } from '@/modules/transacti/domain/repositori/transaction-repository'
import { Injectable } from '@nestjs/common'
import { SubscriptionRepository } from '@/core/domain/repositories/subscription-repository'
import { Subscription } from '@/core/domain/entities/subscription.entity'

import { Either, right } from @core/co@core/either'
interface FetchSubscriptionsUseCaseRequest {
    page: number,
    businessId: string,
}

type FetchSubscriptionsUseCaseResponse = Either<
    null,
    {
        subscriptions: Subscription[]
    }
>

@Injectable()
export class FetchSubscriptionUseCase {
    constructor(private subscriptionRepository: SubscriptionRepository) { }

    async execute({ page, businessId }: FetchSubscriptionsUseCaseRequest): Promise<FetchSubscriptionsUseCaseResponse> {
        const subscriptions = await this.subscriptionRepository.findMany({ page }, businessId)

        return right({
            subscriptions,
        })
    }
}