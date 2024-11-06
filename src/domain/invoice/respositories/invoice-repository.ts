import { PaginationParams } from '@/core/repositories/pagination-params'
import { Invoice } from '@/domain/invoice/entities/invoice'
import { InvoiceDetails } from '../entities/value-objects/invoice-details'

export abstract class InvoiceRepository {

    abstract findById(id: string, businessId: string): Promise<Invoice | null>
    abstract findByIdDetails(id: string, businessId: string): Promise<InvoiceDetails | null>

    abstract findMany(params: PaginationParams, businessId: string): Promise<Invoice[]>
    //abstract findManyDetails(params: PaginationParams, businessId: string): Promise<InvoiceDetails[]>

    abstract create(payment: Invoice): Promise<void>
    abstract save(payment: Invoice): Promise<void>

}