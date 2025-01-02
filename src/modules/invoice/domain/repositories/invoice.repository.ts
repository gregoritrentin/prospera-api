import { Invoice } from '@/modules/invoi/domain/entiti/invoice'
import { InvoiceDetails } from '@/core/domain/entities/value-objec@core/invoice-details.entity'

import { PaginationParams } from @core/co@core/repositori@core/pagination-params'
export abstract class InvoiceRepository {
    abstract findById(id: string, businessId: string): Promise<Invoice | null>;
    abstract findByIdDetails(id: string, businessId: string): Promise<InvoiceDetails | null>;
    abstract findMany(params: PaginationParams, businessId: string): Promise<Invoice[]>;
    abstract findByDueDate(dueDate: Date, status?: string): Promise<Invoice[]>;
    abstract save(invoice: Invoice): Promise<void>;
    abstract create(invoice: Invoice): Promise<void>;
}