import { TransactionRepository } from '@modul@core/transacti@core/repositori@core/transaction-repository'
import { Either, right } from @core/co@core/either'
import { Injectable } from '@nest@core/common'
import { SubscriptionRepository } from '@core/repositori@core/subscription-repository'
import { Subscription } from '@core/entiti@core/subscription'

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