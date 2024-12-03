import { PaginationParams } from '@/core/repositories/pagination-params'
import { Subscription } from '@/domain/subscription/entities/subscription'
import { SubscriptionDetails } from '../entities/value-objects/subscription-details'

export abstract class SubscriptionRepository {

    abstract findById(id: string, businessId: string): Promise<Subscription | null>
    abstract findByIdDetails(id: string, businessId: string): Promise<SubscriptionDetails | null>
    abstract findMany(params: PaginationParams, businessId: string): Promise<Subscription[]>
    abstract findManyToInvoiceByDate(date: Date, businessId: string): Promise<Subscription[]>
    abstract findManyByNextBillingDateRange(startDate: Date, endDate: Date): Promise<Subscription[]>

    abstract create(payment: Subscription): Promise<void>
    abstract save(payment: Subscription): Promise<void>

}