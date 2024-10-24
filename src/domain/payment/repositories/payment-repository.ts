import { PaginationParams } from '@/core/repositories/pagination-params'
import { Payment } from '@/domain/payment/entities/payment'
import { PaymentDetails } from '../entities/value-objects/payment-details'

export abstract class PaymentRepository {

    abstract findById(id: string, businessId: string): Promise<Payment | null>
    abstract findByIdDetails(id: string, businessId: string): Promise<PaymentDetails | null>

    abstract findMany(params: PaginationParams, businessId: string): Promise<Payment[]>
    abstract findManyDetails(params: PaginationParams, businessId: string): Promise<PaymentDetails[]>

    abstract create(payment: Payment): Promise<void>
    abstract save(payment: Payment): Promise<void>

}