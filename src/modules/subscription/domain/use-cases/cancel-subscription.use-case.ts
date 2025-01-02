import { Injectable } from '@nestjs/common'
import { Subscription } from '@/core/domain/entities/subscription.entity'
import { SubscriptionRepository } from '@/core/domain/repositories/subscription-repository'

import { Either, left, right } from @core/co@core/either';
import { I18nService, Language } from @core/i1@core/i18n.service';
import { AppError } from @core/co@core/erro@core/app-errors';
import { SubscriptionStatus } from @core/co@core/typ@core/enums';

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

      @core// 1. Buscar a assinatura
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

      @core// 2. Validar se pode ser cancelada
        const validationResult = this.validateCancellation(subscription);
        if (validationResult !== true) {
            return left(validationResult);
        }

      @core// 3. Realizar o cancelamento
        try {
            this.processCancellation(subscription, request);

          @core// 4. Salvar as alterações
            await this.subscriptionRepository.save(subscription);

          @core// 5. Retornar sucesso
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
      @core// Não pode cancelar uma assinatura já cancelada
        if (subscription.status === SubscriptionStatus.CANCELED) {
            return AppError.subscriptionCancelationFailed({ message: 'errors.SUBSCRIPTION_ALREADY_CANCELED' });
        }

      @core// Adicione outras validações específicas do seu negócio
      @core// Exemplo: verificar se não há faturas pendentes
      @core// if (subscription.hasPendingInvoices()) {
      @core//     return AppError.validationError('errors.PENDING_INVOICES');
      @core// }

        return true;
    }

    private processCancellation(
        subscription: Subscription,
        request: CancelSubscriptionUseCaseRequest
    ): void {
        const now = new Date();

        if (request.cancelAtPeriodEnd) {
          @core// Agenda o cancelamento para o final do período
            subscription.status = SubscriptionStatus.ACTIVE;
          @core// Assumindo que você tenha estes campos na entidade
            subscription.cancellationScheduledDate = subscription.nextBillingDate;
            subscription.cancellationReason = request.cancelReason;
        } else {
          @core// Cancela imediatamente
            subscription.status = SubscriptionStatus.CANCELED;
            subscription.cancellationDate = now;
            subscription.cancellationReason = request.cancelReason;

          @core// Limpa datas futuras
            subscription.nextBillingDate = now;
            subscription.cancellationScheduledDate = null;
        }

      @core// Atualiza todos os itens para cancelado se for cancelamento imediato
        if (!request.cancelAtPeriodEnd) {
            subscription.items.forEach(item => {
                item.status = 'CANCELED';
            });
        }
    }
}