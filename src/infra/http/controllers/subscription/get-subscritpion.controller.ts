import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { I18nService, Language } from '@/i18n/i18n.service';
import { SubscriptionDetails } from '@/domain/subscription/entities/value-objects/subscription-details';
import { AppError } from '@/core/errors/app-errors';
import { SubscriptionRepository } from '@/domain/subscription/repositories/subscription-repository';

interface GetSaleUseCaseRequest {
    businessId: string;
    subscriptionId: string;
}

type GetSaleUseCaseResponse = Either<
    AppError,
    {
        subscription: SubscriptionDetails;
        message: string;
    }
>;

@Injectable()
export class GetBoletoUseCase {
    constructor(
        private subscriptionRepository: SubscriptionRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: GetSaleUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<GetSaleUseCaseResponse> {
        const subscription = await this.subscriptionRepository.findByIdDetails(request.subscriptionId, request.businessId);

        if (!subscription) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (request.businessId !== subscription.businessId.toString()) {
            return left(AppError.notAllowed('errors.NOT_ALLOWED'));
        }

        return right({
            subscription,
            message: this.i18nService.translate('messages.RECORD_RETRIEVED', language)
        });
    }
}