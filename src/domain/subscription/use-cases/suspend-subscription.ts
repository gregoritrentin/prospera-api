import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { Subscription } from '../entities/subscription';
import { SubscriptionRepository } from '../repositories/subscription-repository';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';
import { SubscriptionStatus } from '@/core/types/enums';
import { SubscriptionStatusValidator } from '../entities/subscription-status-validator';

interface SuspendSubscriptionUseCaseRequest {
    businessId: string;
    subscriptionId: string;
}

type SuspendSubscriptionUseCaseResponse = Either<
    AppError,
    {
        subscription: Subscription;
        message: string;
    }
>;

@Injectable()
export class SuspendSubscriptionUseCase {
    constructor(
        private subscriptionRepository: SubscriptionRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: SuspendSubscriptionUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<SuspendSubscriptionUseCaseResponse> {

        // 1. Find subscription
        const subscription = await this.subscriptionRepository.findById(
            request.subscriptionId,
            request.businessId
        );

        if (!subscription) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'));
        }

        if (request.businessId !== subscription.businessId.toString()) {
            return left(AppError.notAllowed('errors.RESOURCE_NOT_ALLOWED'));
        }

        // 2. Validate status transition
        if (!SubscriptionStatusValidator.isValidTransition(
            subscription.status,
            SubscriptionStatus.SUSPENDED
        )) {
            return left(AppError.invalidStatusTransition('errors.INVALID_STATUS_TRANSITION'));
        }

        // 3. Update status
        subscription.status = SubscriptionStatus.SUSPENDED;

        // 4. Save changes
        await this.subscriptionRepository.save(subscription);

        // 5. Return success
        return right({
            subscription,
            message: this.i18nService.translate('messages.SUBSCRIPTION_SUSPENDED', language)
        });
    }
}