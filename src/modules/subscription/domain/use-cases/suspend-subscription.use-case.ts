import { Injectable } from '@nestjs/common'
import { Subscription } from '@/core/domain/entities/subscription.entity'
import { SubscriptionRepository } from '@/core/domain/repositories/subscription-repository'
import { SubscriptionStatusValidator } from '@/core/domain/entities/subscription-status-validator.entity'

import { Either, left, right } from @core/co@core/either';
import { I18nService, Language } from @core/i1@core/i18n.service';
import { AppError } from @core/co@core/erro@core/app-errors';
import { SubscriptionStatus } from @core/co@core/typ@core/enums';
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

      @core// 1. Find subscription
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

      @core// 2. Validate status transition
        if (!SubscriptionStatusValidator.isValidTransition(
            subscription.status,
            SubscriptionStatus.SUSPENDED
        )) {
            return left(AppError.invalidStatusTransition('errors.INVALID_STATUS_TRANSITION'));
        }

      @core// 3. Update status
        subscription.status = SubscriptionStatus.SUSPENDED;

      @core// 4. Save changes
        await this.subscriptionRepository.save(subscription);

      @core// 5. Return success
        return right({
            subscription,
            message: this.i18nService.translate('messages.SUBSCRIPTION_SUSPENDED', language)
        });
    }
}