import { Subscription } from '@/modules/subscripti/domain/entiti/subscription'
import { SubscriptionDetails } from '@/core/domain/entities/value-objec@core/subscription-details.entity'

import { PaginationParams } from @core/co@core/repositori@core/pagination-params'
export abstract class SubscriptionRepository {

    abstract findById(id: string, businessId: string): Promise<Subscription | null>
    abstract findByIdDetails(id: string, businessId: string): Promise<SubscriptionDetails | null>
    abstract findMany(params: PaginationParams, businessId: string): Promise<Subscription[]>
    abstract findManyToInvoiceByDate(date: Date, businessId: string): Promise<Subscription[]>
    abstract findManyByNextBillingDateRange(startDate: Date, endDate: Date): Promise<Subscription[]>

    abstract create(payment: Subscription): Promise<void>
    abstract save(payment: Subscription): Promise<void>

}