import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { I18nService, Language } from '@/i18n/i18n.service';
import { SubscriptionDetails } from '@/domain/subscription/entities/value-objects/subscription-details';
import { AppError } from '@core/error/app-errors';
import { SubscriptionRepository } from '@/domain/subscription/repositories/subscription-repository';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiSecurity, ApiHeader } from '@nestjs/swagger';

interface GetSubscriptionUseCaseRequest {
    businessId: string;
    subscriptionId: string;
}

type GetSubscriptionUseCaseResponse = Either<
    AppError,
    {
        subscription: SubscriptionDetails;
        message: string;
    }
>;

@ApiTags('Subscriptions')
@Injectable()
@ApiSecurity('bearer')
export class GetSubscriptionUseCase {
    constructor(
        private subscriptionRepository: SubscriptionRepository,
        private i18nService: I18nService
    ) { }

    @ApiOperation({
        summary: 'Get subscription details',
        description: 'Retrieves detailed information about a specific subscription'
    })
    @ApiParam({
        name: 'subscriptionId',
        description: 'ID of the subscription to retrieve',
        type: 'string',
        required: true
    })
    @ApiHeader({
        name: 'language',
        required: false,
        description: 'Preferred language for messages (default: en-US)',
    })
    @ApiResponse({
        status: 200,
        description: 'Subscription retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                subscription: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Subscription ID'
                        },
                        businessId: {
                            type: 'string',
                            description: 'Business ID'
                        },
                        status: {
                            type: 'string',
                            description: 'Current subscription status'
                        },
                        details: {
                            type: 'object',
                            description: 'Detailed subscription information'
                        }
                    }
                },
                message: {
                    type: 'string',
                    description: 'Success message in requested language'
                }
            }
        }
    })
    @ApiResponse({
        status: 404,
        description: 'Subscription not found',
        schema: {
            type: 'object',
            properties: {
                error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'errors.RESOURCE_NOT_FOUND'
                        }
                    }
                }
            }
        }
    })
    @ApiResponse({
        status: 403,
        description: 'Access not allowed',
        schema: {
            type: 'object',
            properties: {
                error: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'errors.NOT_ALLOWED'
                        }
                    }
                }
            }
        }
    })
    async execute(
        request: GetSubscriptionUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<GetSubscriptionUseCaseResponse> {
        const subscription = await this.subscriptionRepository.findByIdDetails(
            request.subscriptionId,
            request.businessId
        );

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