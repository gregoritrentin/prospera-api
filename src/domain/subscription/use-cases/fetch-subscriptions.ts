import { TransactionRepository } from '@/domain/transaction/repositories/transaction-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { SubscriptionRepository } from '../repositories/subscription-repository'
import { Subscription } from '../entities/subscription'

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