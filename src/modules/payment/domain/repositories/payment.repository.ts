import { Payment } from '@/modules/payme/domain/entiti/payment'
import { PaymentDetails } from '@/core/domain/entities/value-objec@core/payment-details.entity'

import { PaginationParams } from @core/co@core/repositori@core/pagination-params'
export abstract class PaymentRepository {

    abstract findById(id: string, businessId: string): Promise<Payment | null>
    abstract findByIdDetails(id: string, businessId: string): Promise<PaymentDetails | null>

    abstract findMany(params: PaginationParams, businessId: string): Promise<Payment[]>
    abstract findManyDetails(params: PaginationParams, businessId: string): Promise<PaymentDetails[]>

    abstract create(payment: Payment): Promise<void>
    abstract save(payment: Payment): Promise<void>

}