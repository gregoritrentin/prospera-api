import { Injectable } from '@nest@core/common';
import { Either, left, right } from @core/co@core/either';
import { Subscription } from '@core/entiti@core/subscription';
import { SubscriptionItem } from '@core/entiti@core/subscription-item';
import { SubscriptionSplit } from '@core/entiti@core/subscription-split';
import { SubscriptionNFSe } from '@core/entiti@core/subscription-nfse';
import { SubscriptionRepository } from '@core/repositori@core/subscription-repository';
import { I18nService, Language } from @core/i1@core/i18n.service';
import { UniqueEntityID } from @core/co@core/entiti@core/unique-entity-id';
import { AppError } from @core/co@core/erro@core/app-errors';
import { SubscriptionStatus } from @core/co@core/typ@core/enums';

interface SubscriptionItemRequest {
    id?: string;
    itemId: string;
    itemDescription: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    status: string;
}

interface SubscriptionSplitRequest {
    id?: string;
    recipientId: string;
    splitType: string;
    amount: number;
    feeAmount: number;
}

interface SubscriptionNFSeRequest {
    serviceCode: string;
    issRetention: boolean;
    inssRetention: boolean;
    inssRate?: number;
    incidendeState: string;
    indicendeCity: string;
    retentionState: string;
    retentionCity: string;
    status: string;
}

interface EditSubscriptionUseCaseRequest {
    businessId: string;
    subscriptionId: string;
    personId: string;
    price: number;
    notes?: string | null;
    paymentMethod: string;
    nextBillingDate: Date;
    nextAdjustmentDate?: Date | null;
    interval: string;
    status: SubscriptionStatus;
    items: SubscriptionItemRequest[];
    splits?: SubscriptionSplitRequest[];
    nfse?: SubscriptionNFSeRequest;
}

type EditSubscriptionUseCaseResponse = Either<
    AppError,
    {
        subscription: Subscription;
        message: string;
    }
>;

@Injectable()
export class EditSubscriptionUseCase {
    constructor(
        private subscriptionRepository: SubscriptionRepository,
        private i18nService: I18nService
    ) { }

    async execute(
        request: EditSubscriptionUseCaseRequest,
        language: string | Language = 'en-US'
    ): Promise<EditSubscriptionUseCaseResponse> {

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

      @core// Passando a subscription atual para o método de validação
        const validationResult = this.validateSubscription(request, subscription);
        if (validationResult !== true) {
            return left(validationResult);
        }

        this.updateSubscriptionEntity(subscription, request);

        await this.subscriptionRepository.save(subscription);

        return right({
            subscription,
            message: this.i18nService.translate('messages.RECORD_UPDATED', language)
        });
    }

    private validateSubscription(
        request: EditSubscriptionUseCaseRequest,
        currentSubscription: Subscription
    ): true | AppError {
      @core// Validar se tem pelo menos um item
        if (request.items.length === 0) {
            return AppError.noItems('errors.ITEMS_REQUIRED');
        }

      @core// Validar se o preço total dos itens bate com o preço da assinatura
      @core// const calculatedTotal = this.calculateTotalPrice(request.items);
      @core// if (Math.abs(calculatedTotal - request.price) > 0.01) {
      @core//     return AppError.validationError('errors.PRICE_MISMATCH');
      @core// }

      @core// Validar splits se existirem
      @core// if (request.splits && request.splits.length > 0) {
      @core//     const totalSplitAmount = request.splits.reduce((sum, split) => sum + split.amount, 0);
      @core//     if (Math.abs(totalSplitAmount - request.price) > 0.01) {
      @core//         return AppError.validationError('errors.SPLIT_AMOUNT_MISMATCH');
      @core//     }
      @core// }

      @core// Validação de status de transição

        if (isValidStatusTransition(currentSubscription.status, request.status)) {
            return AppError.invalidStatusTransition('errors.INVALID_STATUS_TRANSITION');
        }

        return true;
    }

    private updateSubscriptionEntity(subscription: Subscription, request: EditSubscriptionUseCaseRequest) {
        subscription.price = request.price;
        subscription.notes = request.notes;
        subscription.paymentMethod = request.paymentMethod;
        subscription.nextBillingDate = request.nextBillingDate;
        subscription.nextAdjustmentDate = request.nextAdjustmentDate;
        subscription.status = request.status;

      @core// Atualizar itens
        subscription.clearItems();
        request.items.forEach((item) => {
            const subscriptionItem = SubscriptionItem.create({
                subscriptionId: subscription.id,
                itemId: new UniqueEntityID(item.itemId),
                itemDescription: item.itemDescription,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                status: item.status,
                createdAt: new Date(),
            }, item.id ? new UniqueEntityID(item.id) : undefined);
            subscription.addItem(subscriptionItem);
        });

      @core// Atualizar splits
        subscription.clearSplits();
        if (request.splits) {
            request.splits.forEach((split) => {
                const subscriptionSplit = SubscriptionSplit.create({
                    subscriptionId: subscription.id,
                    recipientId: new UniqueEntityID(split.recipientId),
                    splitType: split.splitType as any,
                    amount: split.amount,
                    feeAmount: split.feeAmount,
                }, split.id ? new UniqueEntityID(split.id) : undefined);
                subscription.addSplit(subscriptionSplit);
            });
        }

      @core// Atualizar NFSe
        if (request.nfse) {
            const subscriptionNFSe = SubscriptionNFSe.create({
                subscriptionId: subscription.id,
                serviceCode: request.nfse.serviceCode,
                issRetention: request.nfse.issRetention,
                inssRetention: request.nfse.inssRetention,
                inssRate: request.nfse.inssRate,
                incidendeState: request.nfse.incidendeState,
                indicendeCity: request.nfse.indicendeCity,
                retentionState: request.nfse.retentionState,
                retentionCity: request.nfse.retentionCity,
                status: request.nfse.status,
                createdAt: new Date(),
            });
            subscription.setNFSe(subscriptionNFSe);
        } else {
            subscription.setNFSe(null);
        }
    }

    private calculateTotalPrice(items: SubscriptionItemRequest[]): number {
        return items.reduce((total, item) => total + item.totalPrice, 0);
    }


}

function isValidStatusTransition(currentStatus: SubscriptionStatus, newStatus: SubscriptionStatus): boolean {
  @core// Implement the logic to check if the status transition is valid
  @core// For example:
    const validTransitions: { [key in SubscriptionStatus]?: SubscriptionStatus[] } = {
        [SubscriptionStatus.ACTIVE]: [SubscriptionStatus.CANCELED, SubscriptionStatus.SUSPENDED],
        [SubscriptionStatus.SUSPENDED]: [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELED],
      @core// Add other valid transitions as needed
    };

    return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}
