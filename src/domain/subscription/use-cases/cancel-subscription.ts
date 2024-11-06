import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { Subscription } from '../entities/subscription';
import { SubscriptionRepository } from '../repositories/subscription-repository';
import { I18nService, Language } from '@/i18n/i18n.service';
import { AppError } from '@/core/errors/app-errors';
import { SubscriptionStatus } from '@/core/types/enums';

interface CancelSubscriptionUseCaseRequest {
    businessId: string;
    subscriptionId: string;
    cancelReason?: string;
    cancelAtPeriodEnd?: boolean;
}

type CancelSubscriptionUseCaseResponse = Either<
    AppError,
    {
        subscription: Subscription;
        message: string;
    }
>;

@Injectable()
export class CancelSubscriptionUseCase {
    constructor(
        private subscriptionRepository: SubscriptionRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: CancelSubscriptionUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<CancelSubscriptionUseCaseResponse> {

        // 1. Buscar a assinatura
        const subscription = await this.subscriptionRepository.findById(
            request.subscriptionId,
            request.businessId
        );

        if (!subscription) {
            return left(AppError.resourceNotFound('errors.RESOURCE_NOT_FOUND'))
        }

        if (request.businessId !== subscription.businessId.toString()) {
            return left(AppError.notAllowed('errors.RESOURCE_NOT_ALLOWED'))
        }

        // 2. Validar se pode ser cancelada
        const validationResult = this.validateCancellation(subscription);
        if (validationResult !== true) {
            return left(validationResult);
        }

        // 3. Realizar o cancelamento
        try {
            this.processCancellation(subscription, request);

            // 4. Salvar as alterações
            await this.subscriptionRepository.save(subscription);

            // 5. Retornar sucesso
            return right({
                subscription,
                message: this.i18nService.translate(
                    request.cancelAtPeriodEnd
                        ? 'messages.SUBSCRIPTION_SCHEDULED_CANCELLATION'
                        : 'messages.SUBSCRIPTION_CANCELLED',
                    language
                )
            });

        } catch (error) {
            return left(AppError.internalServerError('errors.INTERNAL_SERVER_ERROR'));
        }
    }

    private validateCancellation(subscription: Subscription): true | AppError {
        // Não pode cancelar uma assinatura já cancelada
        if (subscription.status === SubscriptionStatus.CANCELED) {
            return AppError.subscriptionCancelationFailed({ message: 'errors.SUBSCRIPTION_ALREADY_CANCELED' });
        }

        // Adicione outras validações específicas do seu negócio
        // Exemplo: verificar se não há faturas pendentes
        // if (subscription.hasPendingInvoices()) {
        //     return AppError.validationError('errors.PENDING_INVOICES');
        // }

        return true;
    }

    private processCancellation(
        subscription: Subscription,
        request: CancelSubscriptionUseCaseRequest
    ): void {
        const now = new Date();

        if (request.cancelAtPeriodEnd) {
            // Agenda o cancelamento para o final do período
            subscription.status = SubscriptionStatus.ACTIVE;
            // Assumindo que você tenha estes campos na entidade
            subscription.cancellationScheduledDate = subscription.nextBillingDate;
            subscription.cancellationReason = request.cancelReason;
        } else {
            // Cancela imediatamente
            subscription.status = SubscriptionStatus.CANCELED;
            subscription.cancellationDate = now;
            subscription.cancellationReason = request.cancelReason;

            // Limpa datas futuras
            subscription.nextBillingDate = now;
            subscription.cancellationScheduledDate = null;
        }

        // Atualiza todos os itens para cancelado se for cancelamento imediato
        if (!request.cancelAtPeriodEnd) {
            subscription.items.forEach(item => {
                item.status = 'CANCELED';
            });
        }
    }
}