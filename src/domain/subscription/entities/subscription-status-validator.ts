import { SubscriptionStatus } from "@/core/types/enums";

export class SubscriptionStatusValidator {
    private static readonly validTransitions: Record<SubscriptionStatus, SubscriptionStatus[]> = {
        [SubscriptionStatus.ACTIVE]: [
            SubscriptionStatus.PASTDUE,
            SubscriptionStatus.SUSPENDED,
            SubscriptionStatus.CANCELED
        ],
        [SubscriptionStatus.PASTDUE]: [
            SubscriptionStatus.ACTIVE,
            SubscriptionStatus.SUSPENDED,
            SubscriptionStatus.CANCELED
        ],
        [SubscriptionStatus.SUSPENDED]: [
            SubscriptionStatus.ACTIVE,
            SubscriptionStatus.CANCELED
        ],
        [SubscriptionStatus.CANCELED]: [
            SubscriptionStatus.ACTIVE
        ],
    };

    static isValidTransition(currentStatus: SubscriptionStatus, newStatus: SubscriptionStatus): boolean {
        return this.validTransitions[currentStatus]?.includes(newStatus) ?? false;
    }
}